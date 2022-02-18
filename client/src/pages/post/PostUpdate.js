import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import omitDeep from 'omit-deep-lodash';
import { useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SINGLE_POST } from '../../graphql/queries';
import { POST_UPDATE } from '../../graphql/mutations';
import FileUpload from '../../components/FileUpload';

const PostUpdate = () => {
  const { postid } = useParams();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    content: '',
    image: {
      url: 'https://via.placeholder.com/200x200.png?text=Post',
      public_id: '123',
    },
  });
  const { content, image } = values;

  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);

  const [postUpdate] = useMutation(POST_UPDATE);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid }});
  }, []);

  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: omitDeep(singlePost.singlePost.image, ['__typename']),
      });
    }
  }, [singlePost]);

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    postUpdate({ variables: { input: values }});
    setLoading(false);
    toast.success('Post updated');
  };

  const updateForm = () => (
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
        Update post
      </button>
    </form>
  );

  return (
    <div className='container p-5'>
      {loading
        ? <h4 className='text-danger'>Loading...</h4>
        : <h4>Update post</h4>}

      <FileUpload
        values={values}
        setValues={setValues}
        loading={loading}
        setLoading={setLoading}
        singleUpload
      />

      <div className='row'>
        <div className='col'>
          {updateForm()}
        </div>
      </div>
    </div>
  );
};

export default PostUpdate;
