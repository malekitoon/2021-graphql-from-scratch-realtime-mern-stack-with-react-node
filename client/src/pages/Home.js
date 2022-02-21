import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../graphql/queries';
import { POST_ADDED, POST_UPDATED, POST_DELETED } from '../graphql/subscriptions';
import PostCard from '../components/PostCard';
import PostPagination from '../components/PostPagination';
import { toast } from 'react-toastify';

const Home = () => {
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const { data, loading } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  const { data: postCount } = useQuery(TOTAL_POSTS);

  // subscription > post added
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
      // read query from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts],
        }
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [
          { query: GET_ALL_POSTS, variables: { page }},
        ],
      });

      // show toast notification
      toast.success('Post added!');
    },
  });
  // subscription > post updated
  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      toast.success('Post updated!');
    },
  });
  // subscription > post deleted
  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
      // read query from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      const filteredPosts = allPosts.filter(post => post._id !== data.postDeleted._id);

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts,
        }
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [
          { query: GET_ALL_POSTS, variables: { page }},
        ],
      });

      // show toast notification
      toast.error('Post deleted!');
    },
  });

  const [fetchPosts, fetchPostsResult] = useLazyQuery(GET_ALL_POSTS);
  const { data: fetchPostsData /*, loading: fetchPostsLoading */ } = fetchPostsResult;

  if (loading) return <p className='p-5'>Loading...</p>;

  return (
    <div className='container'>
      <div className='row p-5'>
        {data && data.allPosts.map(post => (
          <div key={post._id} className='col-md-4 pt-5'>
            <PostCard post={post} />
          </div>))}
      </div>

      <PostPagination
        page={page}
        setPage={setPage}
        postCount={postCount}
      />
    </div>
  );
}

export default Home;
