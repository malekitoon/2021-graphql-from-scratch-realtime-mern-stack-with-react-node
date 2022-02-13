import React, { useState, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import omitDeep from 'omit-deep-lodash';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import { AuthContext } from '../../context/authContext';
import login from './Login';

const Profile = () => {
  const { state } = useContext(AuthContext);
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

  const { username, name, email, about, images } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await userUpdate({ variables: { input: { ...values, email: undefined } }});

    setLoading(false);
  };

  const handleChange = async (e) => {
    setValues({...values, [e.target.name]: e.target.value });
  };

  const fileResizeAndUpload = async (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          'JPEG',
          100,
          0,
          (uri) => {
            axios.post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadImage`,
              { image: uri },
              { headers: { authtoken: state.user.token }},
            )
              .then((response) => {
                setValues({ ...values, images: [...images, response.data] });
              })
              .catch((error) => {
                console.log('CLOUDINARY UPLOAD FAIL', error);
              })
              .finally(() => {
                setLoading(false);
              });
          },
          'base64',
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);

    axios.post(
      `${process.env.REACT_APP_REST_ENDPOINT}/removeImage`,
      { public_id: id },
      { headers: { authtoken: state.user.token }},
    )
      .then((response) => {
        let filteredImages = images.filter(item => item.public_id !== id);
        setValues({ ...values, images: filteredImages });
      })
      .catch(error => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          name='username'
          value={username}
          onChange={handleChange}
          className='form-control'
          placeholder='Username'
          disabled={loading}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          className='form-control'
          placeholder='Name'
          disabled={loading}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          className='form-control'
          placeholder='Email'
          disabled
        />
      </div>

      <div className='form-group'>
        <label htmlFor='about'>About</label>
        <textarea
          name='about'
          value={about}
          onChange={handleChange}
          className='form-control'
          placeholder='About'
          disabled={loading}
        />
      </div>

      <button className='btn btn-primary btn-raised' type='submit' disabled={!email || loading}>Submit</button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='form-group'>
            <label className='btn btn-primary'>
              Upload Image
              <input
                hidden
                type='file'
                accept='image/*'
                onChange={fileResizeAndUpload}
                className='form-control'
                placeholder='Image'
              />
            </label>
          </div>
        </div>
        <div className='col-md-9'>
          {images.map(image => (
            <img
              src={image.url}
              key={image.public_id}
              alt={image.public_id}
              style={{ height: '100px' }}
              className='float-right'
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
      </div>

      {profileUpdateForm()}
    </div>
  );
};

export default Profile;
