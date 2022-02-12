import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';

import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/authContext';
import Nav from './components/Nav';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import Login from './pages/auth/Login';
import PasswordForgot from './pages/auth/PasswordForgot';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import Profile from './pages/auth/Profile';
import Post from './pages/post/Post';


const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    headers: {
      authtoken: user ? user.token : '',
    },
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />

      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/complete-registration' component={CompleteRegistration} />
        <Route exact path='/password/forgot' component={PasswordForgot} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute exact path='/password/update' component={PasswordUpdate} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <PrivateRoute exact path='/post/create' component={Post} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
