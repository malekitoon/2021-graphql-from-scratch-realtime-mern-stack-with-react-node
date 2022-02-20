import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Search = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    history.push(`/search/${query}`);
  };

  return (
    <form
      className="form-inline my-2 my-lg-0"
      onSubmit={handleSubmit}
    >
      <input
        type='search'
        className='form-control'
        placeholder='Type query'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label='Search'
      />
      <button
        className='btn btn-outline-primary'
        type='submit'
        data-mdb-ripple-color='dark'
      >
        Search
      </button>
    </form>
  );
};

export default Search;
