import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH } from '../graphql/queries';
import PostCard from './PostCard';

const SearchResult = () => {
  const { query } = useParams();
  const { data, loading } = useQuery(SEARCH, {
    variables: { query },
  });

  if (loading) {
    return (
      <div className='container p-5 text-center'>
        <h4 className='text-danger'>Loading...</h4>
      </div>
    );
  }

  if (data && !data.search.length) {
    return (
      <div className='container p-5 text-center'>
        <h4 className='text-danger'>Nothing found for "{query}" :(</h4>
      </div>
    );
  }

  return (
    <div className='container p-5'>
      <h4>Search results for: "{query}"</h4>

      <div className='row'>
        {data && data.search && data.search.map((post) => (
          <div key={post._id} className='col-md-4 pt-5'>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
