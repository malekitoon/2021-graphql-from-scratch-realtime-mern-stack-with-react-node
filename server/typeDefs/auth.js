const { gql } = require('apollo-server-express');

module.exports = gql`
  # custom type
  type UserCreateResponse {
    username: String!
    email: String!
  }
  
  type Query {
    me: String!
  }
  
  type Mutation {
    userCreate: UserCreateResponse!
  }
`;
