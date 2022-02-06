import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Nav from './components/Nav';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Nav />

      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
