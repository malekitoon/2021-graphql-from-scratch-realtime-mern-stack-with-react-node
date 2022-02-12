import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../firebase';
import AuthForm from '../../components/forms/AuthForm';

const PasswordUpdate = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await updatePassword(auth.currentUser, password)
      .then(() => {
        toast.success('Password updated');
        history.push('/profile');
      })
      .catch((error) => {
        console.log('Password update error:', error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Password Update</h4>}

      <AuthForm
        handleSubmit={handleSubmit}
        loading={loading}
        hideEmailInput
        showPasswordInput
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default PasswordUpdate;
