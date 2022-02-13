const { gql } = require('apollo-server-express');

module.exports = gql`
  # scalar type
  scalar DateTime
  
  type Image {
    url: String
    public_id: String
  }
  
  type User {
    _id: ID!
    username: String
    email: String
    name: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }
  # custom type
  type UserCreateResponse {
    username: String!
    email: String!
  }

  input ImageInput {
    url: String
    public_id: String
  }
  
  input UserUpdateInput {
    username: String
    name: String
    images: [ImageInput]
    about: String
  }

  type Query {
    profile: User!
  }
  
  type Mutation {
    userCreate: UserCreateResponse!
    userUpdate(input: UserUpdateInput!): User!
  }
`;
