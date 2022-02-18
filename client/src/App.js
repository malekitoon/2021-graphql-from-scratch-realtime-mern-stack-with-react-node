import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { AuthContext } from './context/authContext';
import Nav from './components/Nav';
import Home from './pages/Home';
import Users from './pages/Users';
import Register from './pages/auth/Register';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import Login from './pages/auth/Login';
import PasswordForgot from './pages/auth/PasswordForgot';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import Profile from './pages/auth/Profile';
import SinglePost from './pages/SinglePost';
import PostCreate from './pages/post/Post';
import PostUpdate from './pages/post/PostUpdate';
import SingleUser from './pages/SingleUser';

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  console.log('user=', user);

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
        <Route exact path='/users' component={Users} />
        <PublicRoute exact path='/register' component={Register} />
        <PublicRoute exact path='/complete-registration' component={CompleteRegistration} />
        <PublicRoute exact path='/password/forgot' component={PasswordForgot} />
        <PublicRoute exact path='/login' component={Login} />
        <PrivateRoute exact path='/password/update' component={PasswordUpdate} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <PrivateRoute exact path='/post/create' component={PostCreate} />
        <PrivateRoute exact path='/post/update/:postid' component={PostUpdate} />
        <Route exact path='/user/:username' component={SingleUser} />
        <Route exact path='/post/:postid' component={SinglePost} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
