import { gql } from '@apollo/client';
import { USER_INFO, POST_DATA } from './fragments';

export const USER_UPDATE = gql`
  mutation UserUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;


export const POST_CREATE = gql`
  mutation PostCreate($input: PostCreateInput!) {
    postCreate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_UPDATE = gql`
  mutation PostUpdate($input: PostUpdateInput!) {
    postUpdate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_DELETE = gql`
  mutation PostDelete($postId: String!) {
    postDelete(postId: $postId) {
      _id
    }
  }
`;