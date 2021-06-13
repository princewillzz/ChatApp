import Realm from 'realm';
import {ChatsSchema, CHATS_SCHEMA} from './allSchemas';

const ChatsdatabaseOptions = {
  path: 'untangledchat.chats.realm',
  schema: [ChatsSchema],
  schemaVersion: 3,
};

export const insertChats = chatDetails =>
  new Promise((resolve, reject) => {
    Realm.open(ChatsdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(CHATS_SCHEMA, chatDetails);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const fetchAllChats = () =>
  new Promise((resolve, reject) => {
    Realm.open(ChatsdatabaseOptions)
      .then(realm => {
        const chats = realm.objects(CHATS_SCHEMA);
        resolve(chats);
      })
      .catch(error => reject(error));
  });

export const fethAllChatsSortedByDateForUser = friendUserId =>
  new Promise((resolve, reject) => {
    Realm.open(ChatsdatabaseOptions)
      .then(realm => {
        const chats = realm
          .objects(CHATS_SCHEMA)
          .filtered(`send_to_id == "${friendUserId}"`)
          .sorted('timestamp', true);
        resolve(chats);
      })
      .catch(error => reject(error));
  });

export const deleteAllChats = () =>
  new Promise((resolve, reject) => {
    Realm.open(ChatsdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.deleteAll();
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const chatSchemaRealmObject = new Realm(ChatsdatabaseOptions);
