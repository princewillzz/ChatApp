import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {baseURL} from '../../config';
import {fetchUserById} from '../db/UsersDB';

const useProfilePictureFromDB = user_token_id => {
  const [imageURI, setImageURI] = useState(null);

  const buildImageURI = imageId => {
    const uri = `${baseURL}/api/users/profile-photo/${imageId}`;
    setImageURI(uri);
  };

  useEffect(() => {
    fetchUserById(user_token_id)
      .then(user => {
        if (!user || !user?.imageId) {
          setImageURI(null);
        } else {
          buildImageURI(user?.imageId);
        }
      })
      .catch(e => {
        console.log(e);
        setImageURI(null);
      });
  }, [user_token_id]);

  return imageURI;
};

export default useProfilePictureFromDB;
