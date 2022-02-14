import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import AuthForm from '../../components/forms/AuthForm';

const PasswordForgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, config)
      .then(() => {
        setEmail('');
        setLoading(false);
        toast.success(`Email is sent to ${email}. Click on the link to reset your password.`);
      })
      .catch((err) => {
        setLoading(false);
        console.log('error on password forgot email', err);
        toast.error(err.message);
      });
  };

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Forgot Password</h4>}

      <AuthForm
        handleSubmit={handleSubmit}
        loading={loading}
        email={email}
        setEmail={setEmail}
      />
    </div>
  );
};

export default PasswordForgot;
