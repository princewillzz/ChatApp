import { RSA } from "react-native-rsa-native";

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

let rsa_keys = null
/**
 * Generate keys and initiate the public state
 * @returns Promise
 */
export const generateRsaKeys = async (userId)=> {
    return RSA.generateKeys(4096) // set key size
    .then(async keys => {
        await SecureStorage.setItem(userId, JSON.stringify(keys))
        rsa_keys = keys
        return keys
    });

}

export const initiateRSAKeysInitialization = async(userId) => {
    const keys = await SecureStorage.getItem(userId)
    rsa_keys = JSON.parse(keys)
}

/**
 * Encrypt a message
 */
export const encryptTextMessage = async (message, rsa_public_key) => {
    if(!rsa_keys) throw new Error("Keys are not initialized")

    return RSA.encrypt(message, rsa_public_key)
}

export const decryptTestMessage = async(message) => {
    if(!rsa_keys) throw new Error("Keys are not initialized")

    return RSA.decrypt(message, rsa_keys.private)
}


export const test_rsa = async (userId) => {
    console.log("testing");
    
    try {

        if(userId.length > 0)
        await generateRsaKeys(userId);

        let msg = "harsha"
        const em = await encryptTextMessage(msg)

        console.log(em);

        const dm = await decryptTestMessage(em)
        console.log(dm);
        console.log(userId);

        
    } catch (error) {
        console.log(error);
    }

}