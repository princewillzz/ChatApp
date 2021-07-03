import {baseURL} from '../../config';

export const signinUser = async siginInfo => {
  const URI = `${baseURL}/auth/authenticate`;

  return fetch(URI, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(siginInfo),
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else throw new Error('Unable to signin...!');
  });
};

export const sendOTPToVerifyNumberDuringRegistration = async userInfo => {
  const URI = `${baseURL}/auth/users/register/send-otp`;

  return fetch(URI, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  }).then(res => {
    if (res.ok) {
      console.log('SuccessFully sent OTP');
    } else {
      throw new Error('Unable to Send OTP!!');
    }
  });
};
