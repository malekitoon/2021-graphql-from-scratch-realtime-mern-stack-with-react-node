import React, { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import AuthForm from '../../components/forms/AuthForm';

const Register = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, config);

    toast.success(`Email is sent to ${email}. Click the link to complete your registration.`);

    window.localStorage.setItem('emailForRegistration', email);
    setEmail('');
    setLoading(false);
  };

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Register</h4>}

      <AuthForm
        handleSubmit={handleSubmit}
        loading={loading}
        email={email}
        setEmail={setEmail}
      />
    </div>
  );
};

export default Register;
