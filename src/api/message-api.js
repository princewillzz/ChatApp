import {baseURL} from '../../config';
import { encryptTextMessage } from '../security/RSAEncryptionService';

let websocket = null;

export const initilizeWebsocketObject = async websocketObject => {
  websocket = websocketObject;
};

export const sendTextMessageToUser = async (textMessageInfo, rsa_public_key) => {
  if (!websocket && !websocket.OPEN)
    throw new Error('Connection not estabilshed');


  const encodedTextMsg = await encryptTextMessage(textMessageInfo.textMessage, rsa_public_key)

  const textMessageDetails = {
    message: encodedTextMsg,
    type: textMessageInfo.type,
    sentTime: textMessageInfo.timestamp,

    sentTo: textMessageInfo.send_to_id,
  };

  websocket.send(JSON.stringify(textMessageDetails));
};

/**
 * @deprecated
 * @param {*} textMessageInfo
 */
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
