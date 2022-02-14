import React, { useEffect, useContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PublicRoute = ({ ...rest }) => {
  const history = useHistory();
  const { state } = useContext(AuthContext);

  useEffect(() => {
    if (state.user) {
      history.push('/profile');
    }
  }, [state.user]);

  return (
    <div className='container-fluid p-5'>
      <Route {...rest} />
    </div>
  );
};

export default PublicRoute;
