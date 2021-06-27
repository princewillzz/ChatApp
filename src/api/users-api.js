import {baseURL} from '../../config';

export const registerUser = async userInfo => {
  const URI = `${baseURL}/auth/users/register`;
  return fetch(URI, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  })
    .then(res => {
      if (res.ok || res.status === 400) {
        return res.json();
        // throw new Error("User already exists");
      } else {
        throw new Error('Unable to register user!!');
      }
    })
    .then(jsonData => {
      if (jsonData?.status === 400) throw new Error(jsonData.message);
      else return jsonData;
    });
};

export const checkIfUsernameExistsAndFetchUsersInfo = async (
  username,
  myAuthToken,
) => {
  const URI = `${baseURL}/api/secured/users/exists/${username}`;
  return fetch(URI, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${myAuthToken}`,
    },
  })
    .then(res => {
      if (res.ok) return res.json();
      if (res.status === 404) throw new Error('User not found');
      throw new Error('Something went wrong');
    })
    .then(data => {
      return data;
    });
};

export const uploadUserProfilePhoto = async (image, myAuthToken) => {
  const formDate = new FormData();
  formDate.append('profile_img', image);

  const URI = `${baseURL}/api/secured/users/profile-photo`;
  return fetch(URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${myAuthToken}`,
    },
    body: formDate,
  }).then(data => {
    return data;
  });
};
