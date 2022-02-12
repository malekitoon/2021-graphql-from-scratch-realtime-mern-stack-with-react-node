import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { signInWithEmailLink, updatePassword, getIdTokenResult } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/authContext';
import { gql } from '@apollo/client';
import AuthForm from '../../components/forms/AuthForm';

const USER_CREATE = gql`
  mutation {
    userCreate {
      username
      email
    }
  }
`;

const CompleteRegistration = () => {
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'))
  }, [history]);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      console.log(result);
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');

        let user = auth.currentUser;
        await updatePassword(user, password);

        // dispatch user with token and email and redirect
        const idTokenResult = await getIdTokenResult(user);
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: { email: user.email, token: idTokenResult.token },
        });

        // make api request to save/update user in mongodb
        userCreate();

        history.push('/profile');
      }
    } catch (e) {
      console.log('register complete error:', e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Complete Your Registration</h4>}

      <AuthForm
        handleSubmit={handleSubmit}
        loading={loading}
        email={email}
        setEmail={setEmail}
        showPasswordInput
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default CompleteRegistration;
