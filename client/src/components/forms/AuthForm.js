import React from 'react';

const AuthForm = ({
  email,
  password = '',
  loading,
  setEmail,
  setPassword,
  handleSubmit,
  showPasswordInput = false,
}) => (
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

    {showPasswordInput && (
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
          id='password'
          placeholder='Enter password'
          disabled={loading}
        />
      </div>
    )}

    <button
      className='btn btn-raised btn-primary'
      disabled={!email || (showPasswordInput && !password) || loading}
      type='submit'
    >
      Submit
    </button>
  </form>
);

export default AuthForm;
