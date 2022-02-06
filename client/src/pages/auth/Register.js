import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};

  return (
    <div className='container p-5'>
      <h4>Register</h4>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='form-control'
            id='email'
            placeholder='Enter email'
            disabled={loading}
          />
        </div>

        <button
          className='btn btn-raised btn-primary'
          disabled={!email || loading}
          type='submit'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
