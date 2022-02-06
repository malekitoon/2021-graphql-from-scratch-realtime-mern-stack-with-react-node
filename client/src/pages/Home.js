import React from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';

const GET_ALL_POSTS = gql`
  {
    allPosts {
      id
      title
      description
    }
  }
`;

const Home = () => {
  const { data, loading } = useQuery(GET_ALL_POSTS);

  const [fetchPosts, fetchPostsResult] = useLazyQuery(GET_ALL_POSTS);
  const { data: fetchPostsData, loading: fetchPostsLoading } = fetchPostsResult;

  if (loading) return <p className='p-5'>Loading...</p>;

  return (
    <div className='container'>
      <div className='row p-5'>
        {data.allPosts.map(post => (
          <div key={post.id} className='col-md-4'>
            <div className='card'>
              <div className='card-body'>
                <div className='card-title'>
                  <h4>{post.title}</h4>
                </div>

                <p className='card-text'>{post.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='row p-5'>
        <button
          className='btn btn-raised btn-primary'
          onClick={() => fetchPosts()}
        >
          Fetch posts
        </button>
        <hr />
        <div>{JSON.stringify(fetchPostsData)}</div>
      </div>
    </div>
  );
}

export default Home;
