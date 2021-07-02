import {baseURL} from '../../config';

export const sendChatMessageToChatBot = async (messageInfo, token_id) => {
  const URI = `${baseURL}/api/secured/chatbot/talk`;

  //   console.log(messageInfo);

  return fetch(URI, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token_id}`,
    },
    body: JSON.stringify(messageInfo),
  })
    .then(res => {
      if (res.status === 200) return res.json();
      else throw new Error('Unable to Get Reply');
    })
    .catch(e => {
      throw new Error('Network Error');
    });
};
