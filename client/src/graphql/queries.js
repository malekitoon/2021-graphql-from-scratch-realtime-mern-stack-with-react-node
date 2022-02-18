import { gql } from '@apollo/client';
import { POST_DATA, USER_INFO } from './fragments';

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
     ...postData
    }
  }
  ${POST_DATA}
`;

export const SINGLE_POST = gql`
  query SinglePost($postId: String!){
    singlePost(postId: $postId) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const POSTS_BY_USER = gql`
  query {
    postsByUser {
      ...postData
    }
  }
  ${POST_DATA}
`;
