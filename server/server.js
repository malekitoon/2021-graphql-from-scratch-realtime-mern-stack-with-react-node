const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
require('dotenv').config();

const app = express();

// types: query / mutation / subscription
const typeDefs = `
  type Query {
     totalPosts: Int!
  }
`;

// resolvers
const resolvers = {
  Query: {
    totalPosts: () => 42,
  },
};

// graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// applyMiddleware method connects ApolloServer to a specific HTTP framework, ie: express
apolloServer.applyMiddleware({ app });

// server
const httpserver = http.createServer(app);

app.get('/rest', (req, res) => {
  res.json({ data: 'you hit rest endpoint great' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is ready at http://localhost:${process.env.PORT}`);
  console.log(`GraphQL server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
