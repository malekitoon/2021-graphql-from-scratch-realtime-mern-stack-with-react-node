import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { gql, useQuery, useMutation } from '@apollo/client';

const PROFILE = gql`
  query {
    profile {
      _id
      username
      name
      email
      about
      images {
        url
        public_id
      }
      createdAt
      updatedAt
    }
  }
`;

const Profile = () => {
  const [values, setValues] = useState({
    username: '',
    name: '',
    email: '',
    about: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const { data } = useQuery(PROFILE);

  useMemo(() => {
    if (data) {
      console.log(data.profile);
      setValues({
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: data.profile.images,
      })
    }
  }, [data]);

  return (
    <div className='container p-5'>
      {JSON.stringify(values)}
    </div>
  );
};

export default Profile;
