import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import FileUpload from '../../components/FileUpload';
import { POST_CREATE, POST_DELETE } from '../../graphql/mutations';
import { POSTS_BY_USER } from '../../graphql/queries';
import PostCard from '../../components/PostCard';

const initialState = {
  content: '',
  image: {
    url: 'https://via.placeholder.com/200x200.png?text=Post',
    public_id: '123',
  },
};

const Post = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const { data: posts } = useQuery(POSTS_BY_USER);

  const { content, image } = values;

  const [postCreate] = useMutation(POST_CREATE, {
    // update cache
    update: (cache, { data: { postCreate }}) => {
      // read Query from cache
      const { postsByUser } = cache.readQuery({
        query: POSTS_BY_USER,
      });
      // write query to cache
      cache.writeQuery({
        query: POSTS_BY_USER,
        data: {
          postsByUser: [postCreate, ...postsByUser],
        }
      })
    },
    onError: (error) => console.log(error),
  });

  const [postDelete] = useMutation(POST_DELETE, {
    update: (cache, { data: { postDelete} }) => {
      console.log('POST DELETE MUTATION', postDelete);
      toast.success('Post deleted');
    },
    onError: (error) => console.log(error),
  });

  const handleDelete = async (postId) => {
    const answer = window.confirm('Are you sure you want to delete this post?');
    if (answer) {
      setLoading(true);
      postDelete({
        variables: { postId },
        refetchQueries: [{ query: POSTS_BY_USER }],
      });
      setValues(initialState);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    postCreate({ variables: { input: values }});
    setValues(initialState);
    setLoading(false);
    toast.success('Post created');
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <textarea
          name='content'
          id='content'
          value={content}
          onChange={handleChange}
          rows='6'
          className='form-control md-textarea'
          placeholder='Write something cool'
          maxLength='150'
          disabled={loading}
        />
      </div>

      <button
        className='btn btn-primary btn-raised'
        type='submit'
        disabled={loading || !content}
      >
        Create post
      </button>
    </form>
  );

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Create a post</h4>}

      <FileUpload
        values={values}
        setValues={setValues}
        loading={loading}
        setLoading={setLoading}
        singleUpload
      />

      <div className='row'>
        <div className='col'>
          {createForm()}
        </div>
      </div>

      <hr />

      <div className='row p-5'>
        {posts && posts.postsByUser.map(post => (
          <div key={post._id} className='col-md-6 pt-5'>
            <PostCard
              post={post}
              showUpdateButton
              showDeleteButton
              handleDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
