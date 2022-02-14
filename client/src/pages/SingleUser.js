import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import UserCard from '../components/UserCard';

const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      username
      name
      email
      images {
        url
        public_id
      }
      about
    }
  }
`;

const SingleUser = () => {
  const params = useParams();

  const { loading, data } = useQuery(PUBLIC_PROFILE, {
    variables: { username: params.username }
  });

  if (loading) return <p className='p-5'>Loading...</p>;

  return (
    <div className='container pt-5'>
      <UserCard user={data.publicProfile} />
    </div>
  );
}

export default SingleUser;
