const { gql } = require('apollo-server-express');
const { DateTimeResolver } = require('graphql-scalars');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');

const postCreate = async (parent, args, { req }) => {
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
  return newPost;
};

const allPosts = async (parent, args, { req }) => {
  return await Post.find({})
    .populate(['postedBy'])
    .sort({ createdAt: -1 })
    .exec();
};

const postsByUser = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  return await Post.find({ email: currentUser.email })
    .populate(['postedBy'])
    .sort({ createdAt: -1 })
    .exec();
};

module.exports = {
  Query: {
    allPosts,
    postsByUser,
  },
  Mutation: {
    postCreate,
  }
};
