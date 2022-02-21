import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
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
import SearchResult from './components/SearchResult';

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  console.log('user=', user);

  // 1. create websocket link
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
    options: {
      reconnect: true,
    }
  });

  // 2. create http link
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  // 3. setContext for authtoken
  const authLink = setContext(() => {
    return {
      headers: {
        authtoken: user ? user.token : '',
      }
    };
  });

  // 4. concat http and authtoken link
  const httpAuthLink = authLink.concat(httpLink);

  // 5. use split to split http link or websocket link
  const link = split(({ query }) => {
    // split link based on operation type
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  }, wsLink, httpAuthLink);

  // 6. create a new apollo client
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  // old client without websockets
  // const client = new ApolloClient({
  //   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  //   cache: new InMemoryCache(),
  //   headers: {
  //     authtoken: user ? user.token : '',
  //   },
  // });

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
        <Route exact path='/search/:query' component={SearchResult} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
