import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { getIdTokenResult, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../firebase';
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

const Login = () => {
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState('malekitoon@gmail.com');
  const [password, setPassword] = useState('qwerty12345');
  const [loading, setLoading] = useState(false);

  const [userCreate] = useMutation(USER_CREATE);

  const googleLogin = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await getIdTokenResult(user);

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: { email: user.email, token: idTokenResult.token },
        });

        // send user info to our server mongodb to either update/create
        userCreate();

        history.push('/profile');
      })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // in video course it was written using await+then
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await getIdTokenResult(user);

      dispatch({
        type: 'LOGGED_IN_USER',
        payload: { email: user.email, token: idTokenResult.token },
      });

      // send user info to our server mongodb to either update/create
      userCreate();

      history.push('/profile');
    } catch (e) {
      console.log('login error', e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Login</h4>}

      <button
        className='btn btn-raised btn-danger mt-5 mb-5'
        onClick={googleLogin}
      >
        Login with Google
      </button>

      <AuthForm
        handleSubmit={handleSubmit}
        loading={loading}
        email={email}
        setEmail={setEmail}
        showPasswordInput
        password={password}
        setPassword={setPassword}
      />

      <Link className='text-danger float-right' to='/password/forgot'>Forgot password?</Link>
    </div>
  );
};

export default Login;
