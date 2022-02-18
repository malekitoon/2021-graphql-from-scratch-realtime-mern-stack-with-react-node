import React from 'react';

const PostPagination = ({
  page = 1,
  setPage = () => {},
  postCount = 0,
}) => {
  let totalPages = Math.ceil(postCount && postCount.totalPosts / 3);
  if (totalPages > 10) { totalPages = 10; }

  const pagination = () => {
    const pages = [];

    pages.push(
      <li key='0'>
        <a
          className={`page-link ${page === 1 ? 'disabled' : ''}`}
          onClick={() => setPage(1)}
        >
          {'<<'}
        </a>
      </li>
    );

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <a
            className={`page-link ${page === i ? 'activePagination' : ''}`}
            onClick={() => setPage(i)}
          >
            {i}
          </a>
        </li>
      );
    }

    pages.push(
      <li key={totalPages + 1}>
        <a
          className={`page-link ${page === totalPages ? 'disabled' : ''}`}
          onClick={() => setPage(totalPages)}
        >
          {'>>'}
        </a>
      </li>
    );

    return pages;
  };

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        {pagination()}
      </ul>
    </nav>
  );
};

export default PostPagination;
