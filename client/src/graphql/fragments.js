import { gql } from '@apollo/client';

export const USER_INFO = gql`
  fragment userInfo on User {
    _id
    username
    name
    email
    about
    images {
      url
      public_id
    }
    createdAt
    updatedAt
  }
`;
