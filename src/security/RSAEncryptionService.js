import {RSA} from 'react-native-rsa-native';

import SecureStorage, {
  ACCESS_CONTROL,
  ACCESSIBLE,
  AUTHENTICATION_TYPE,
} from 'react-native-secure-storage';
import {updatePublicRSAKeyToken} from '../api/users-api';

let rsa_keys = null;

/**
 * Generate keys and initiate the public state
 * @returns Promise
 */
export const generateRsaKeys = async () => {
  return RSA.generateKeys(4096) // set key size
    .then(async keys => {
      // await SecureStorage.setItem(userId, JSON.stringify(keys));
      rsa_keys = keys;
      return keys;
    });
};

export const saveGeneratedRSAKeys = async userId => {
  if (!rsa_keys) throw new Error('Keys are not initialized');
  await SecureStorage.setItem(userId, JSON.stringify(rsa_keys));
};

export const initiateRSAKeysInitialization = async userId => {
  const keys = await SecureStorage.getItem(userId);
  rsa_keys = JSON.parse(keys);

  if (!keys || !rsa_keys) {
    throw new Error('No Keys Found!!');
  }
};

export const reInitializeKeysSaveAndSyncIt = async (userId, user_token_id) => {
  const generatedKeys = await generateRsaKeys();
  console.log('generated!!');
  // Sync with the server
  await updatePublicRSAKeyToken(generatedKeys.public, user_token_id);
  // Save keys
  await saveGeneratedRSAKeys(userId);
  console.log('saved success');
};

/**
 * Encrypt a message
 */
export const encryptTextMessage = async (message, rsa_public_key) => {
  if (!rsa_keys) throw new Error('Keys are not initialized');

  return RSA.encrypt(message, rsa_public_key);
};

export const decryptTestMessage = async message => {
  if (!rsa_keys) throw new Error('Keys are not initialized');

  return RSA.decrypt(message, rsa_keys.private);
};

export const test_rsa = async userId => {
  console.log('testing');

  try {
    if (userId.length > 0) await generateRsaKeys(userId);

    let msg = 'harsha';
    const em = await encryptTextMessage(msg);

    console.log(em);

    const dm = await decryptTestMessage(em);
    console.log(dm);
    console.log(userId);
  } catch (error) {
    console.log(error);
  }
};
