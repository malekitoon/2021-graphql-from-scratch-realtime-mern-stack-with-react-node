import React, { useContext } from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import Image from '../components/Image';

const FileUpload = ({
  singleUpload = false,
  loading,
  setLoading,
  values,
  setValues,
}) => {
  const { state } = useContext(AuthContext);

  const fileResizeAndUpload = async (event) => {
    setLoading(true);

    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          'JPEG',
          100,
          0,
          (uri) => {
            axios.post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadImage`,
              { image: uri },
              { headers: { authtoken: state.user.token }},
            )
              .then((response) => {
                if (singleUpload) {
                  setValues({ ...values, image: response.data });
                } else {
                  const { images } = values;
                  setValues({ ...values, images: [...images, response.data] });
                }
              })
              .catch((error) => {
                console.log('CLOUDINARY UPLOAD FAIL', error);
              })
              .finally(() => {
                setLoading(false);
              });
          },
          'base64',
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);

    axios.post(
      `${process.env.REACT_APP_REST_ENDPOINT}/removeImage`,
      { public_id: id },
      { headers: { authtoken: state.user.token }},
    )
      .then((response) => {
        if (singleUpload) {
          setValues({ ...values, image: { url: '', public_id: '' } });
        } else {
          const { images } = values;
          let filteredImages = images.filter(item => item.public_id !== id);
          setValues({ ...values, images: filteredImages });
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='row'>
      <div className='col-md-3'>
        <div className='form-group'>
          <label className='btn btn-primary'>
            Upload Image
            <input
              hidden
              type='file'
              accept='image/*'
              onChange={fileResizeAndUpload}
              className='form-control'
              placeholder='Image'
            />
          </label>
        </div>
      </div>

      <div className='col-md-9'>
        {values.image && (
          <Image
              key={values.image.public_id}
              image={values.image}
              handleImageRemove={handleImageRemove}
            />
          )}

        {values.images && values.images.map(image => (
            <Image
              key={image.public_id}
              image={image}
              handleImageRemove={handleImageRemove}
            />
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
