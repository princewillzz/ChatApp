import {baseURL} from '../../config';

const websocketConnectionURL = `ws://localhost:8080`;

let websocket = null;

const initiateConnection = async userToken => {
  websocket = new WebSocket(
    `${websocketConnectionURL}/websocket?token=${userToken}`,
  );
};

export const sendTextMessageToFriend = async textMessageInfo => {
  fetch(`${baseURL}/publish/${textMessageInfo.send_to_id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(textMessageInfo.textMessage),
  }).then(res => {
    console.log(res.status);
  });
};
