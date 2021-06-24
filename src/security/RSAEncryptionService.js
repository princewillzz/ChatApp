import { RSA } from "react-native-rsa-native";



let rsa_keys = null
/**
 * Generate keys and initiate the public state
 * @returns Promise
 */
export const generateRsaKeys = async (userId)=> {
    return RSA.generateKeys(4096) // set key size
    .then(keys => {
        rsa_keys = keys
    });

}

/**
 * Encrypt a message
 */
export const encryptTextMessage = async (message) => {
    if(!rsa_keys) throw new Error("Keys are not initialized")

    return RSA.encrypt(message, rsa_keys.public)
}

export const decryptTestMessage = async(message) => {
    if(!rsa_keys) throw new Error("Keys are not initialized")

    return RSA.decrypt(message, rsa_keys.private)
}


export const test_rsa = async () => {
    console.log("testing");
    
    try {

        await generateRsaKeys("test");

        let msg = "harsha"
        const em = await encryptTextMessage(msg)

        console.log(em);

        const dm = await decryptTestMessage(em)
        console.log(dm);

        
    } catch (error) {
        console.log(error);
    }

}