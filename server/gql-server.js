const { ApolloServer } = require('apollo-server');
require('dotenv').config();

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

apolloServer.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});