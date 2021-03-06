const { gql } = require('apollo-server-express');
const { DateTimeResolver } = require('graphql-scalars');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

// subscriptions
const POST_ADDED = 'POST_ADDED';
const POST_UPDATED = 'POST_UPDATED';
const POST_DELETED = 'POST_DELETED';

const allPosts = async (parent, args, { req }) => {
  const currentPage = args.page || 1;
  const perPage = 3;

  return await Post.find({})
    .skip((currentPage - 1) * perPage)
    .populate(['postedBy'])
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
};

const postsByUser = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({ email: currentUser.email });

  return await Post.find({ postedBy: currentUserFromDb })
    .populate(['postedBy'])
    .sort({ createdAt: -1 })
    .exec();
};

const postCreate = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);

  // input validation
  if (args.input.content.trim() === '') throw new Error('Content is required');

  const currentUserFromDb = await User.findOne({ email: currentUser.email });

  const newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb._id,
  })
    .save()
    // .then((post) => post.populate([ { path: 'postedBy', select: '_id username' } ]));
    .then((post) => post.populate([ 'postedBy' ]));

  pubsub.publish(POST_ADDED, { postAdded: newPost });

  return newPost;
};

const postUpdate = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);
  // input validation
  if (args.input.content.trim() === '') throw new Error('Content is required');
  // get current user's mongodb _id based on email
  const currentUserFromDb = await User.findOne({ email: currentUser.email });
  // _id of post to update
  const postToUpdate = await Post.findById(args.input._id).exec();
  // if currentUser id and id of the post's postedBy user _id is same, allow update
  if (currentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString()) {
    throw new Error('Unauthorized action');
  }

  const updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true },
  )
    .exec()
    .then(post => post.populate([ { path: 'postedBy', select: '_id username' } ]));

  pubsub.publish(POST_UPDATED, { postUpdated: updatedPost });

  return updatedPost;
};

const postDelete = async (parent, args, { req, pubsub }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
  const postToDelete = await Post.findById(args.postId).exec();

  if (currentUserFromDb._id.toString() !== postToDelete.postedBy._id.toString()) {
    throw new Error('Unauthorized action');
  }

  const deletedPost =  await Post.findByIdAndDelete(args.postId)
    .exec()
    .then((post) => post.populate([ 'postedBy' ]));

  pubsub.publish(POST_DELETED, { postDeleted: deletedPost });

  return deletedPost;
};

const singlePost = async (parent, args) => {
  return await Post.findById(args.postId).populate(['postedBy']).exec();
};

const totalPosts = async (parent, args) => await Post.find({}).estimatedDocumentCount().exec();

const search = async (parent, { query }) => {
  return await Post.find({ $text: { $search: query }})
    .populate([
      { path: 'postedBy', select: '_id username email' },
    ])
    .exec();
};

module.exports = {
  Query: {
    totalPosts,
    allPosts,
    postsByUser,
    singlePost,
    search,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
  Subscription: {
    postAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_ADDED]),
    },
    postUpdated: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_UPDATED]),
    },
    postDeleted: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_DELETED]),
    },
  },
};
