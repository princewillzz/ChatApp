import {baseURL} from '../../config';

export const constructProfilePhotoURIWithImageId = imageId => {
  return `${baseURL}/api/users/profile-photo/${imageId}`;
};
