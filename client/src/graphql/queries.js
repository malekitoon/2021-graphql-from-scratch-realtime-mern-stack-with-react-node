import { gql } from '@apollo/client';
import { USER_INFO } from './fragments';

export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const GET_ALL_POSTS = gql`
  query {
    allPosts {
      _id
      content
      image {
        url,
        public_id
      }
      postedBy {
        ...userInfo
      }
    }
  }
  ${USER_INFO}
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;