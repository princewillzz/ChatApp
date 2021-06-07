import {baseURL} from '../../config';

export const signinUser = async siginInfo => {
  console.log(JSON.stringify(siginInfo));
  const URI = `${baseURL}/auth/authenticate`;
  console.log(URI);
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
