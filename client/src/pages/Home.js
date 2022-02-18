import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../graphql/queries';
import PostCard from '../components/PostCard';
import PostPagination from '../components/PostPagination';

const Home = () => {
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const { data, loading } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  const { data: postCount } = useQuery(TOTAL_POSTS);
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

      <hr />
      <p>{JSON.stringify(state.user)}</p>
      <hr />
      <div>{JSON.stringify(fetchPostsData)}</div>
    </div>
  );
}

export default Home;
