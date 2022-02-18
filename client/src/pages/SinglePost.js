import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PostCard from '../components/PostCard';
import { SINGLE_POST } from '../graphql/queries';

const SinglePost = () => {
  const { postid } = useParams();

  const { loading, data } = useQuery(SINGLE_POST, {
    variables: { postId: postid }
  });

  if (loading) return <p className='p-5'>Loading...</p>;

  return (
    <div className='container pt-5'>
      <PostCard post={data.singlePost} />
    </div>
  );
}

export default SinglePost;
