const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { authCheck } = require('./helpers/auth');

require('dotenv').config();

// express server
const app = express();

// db setup
const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLOUD, {});
    console.log('DB connected');
  } catch (e) {
    console.log('DB connection error:', e);
  }
}

// execute db connection
db();

// typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));
// resolvers
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

// graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});


// applyMiddleware method connects ApolloServer to a specific HTTP framework, ie: express
apolloServer.applyMiddleware({ app });

// server
const httpserver = http.createServer(app);

app.get('/rest', authCheck, (req, res) => {
  res.json({ data: 'you hit rest endpoint great' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is ready at http://localhost:${process.env.PORT}`);
  console.log(`GraphQL server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
