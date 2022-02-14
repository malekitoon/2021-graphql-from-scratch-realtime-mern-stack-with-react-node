import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import omitDeep from 'omit-deep-lodash';
import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import UserProfile from '../../components/forms/UserProfile';
import FileUpload from '../../components/FileUpload';

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
      setValues(values => ({
        ...values,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: data.profile.images.map(item => omitDeep(item, ['__typename'])),
      }))
    }
  }, [data]);

  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log('USER UPDATE MUTATION IN PROFILE', data);
      toast.success('Profile updated');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await userUpdate({ variables: { input: { ...values, email: undefined } }});

    setLoading(false);
  };

  const handleChange = async (e) => {
    setValues({...values, [e.target.name]: e.target.value });
  };

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-12 pb-3'>
          {loading
            ? <h4 className='text-danger'>Loading...</h4>
            : <h4>Profile</h4>}
        </div>
      </div>

      <FileUpload
        loading={loading}
        setLoading={setLoading}
        values={values}
        setValues={setValues}
      />

      <UserProfile
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        loading={loading}
        {...values}
      />
    </div>
  );
};

export default Profile;
