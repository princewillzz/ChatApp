import Realm from 'realm';
import {UsersSchema, USERS_SCHEMA} from './allSchemas';

const UserdatabaseOptions = {
  path: 'untangledchat.users.realm',
  schema: [UsersSchema],
  schemaVersion: 0,
};

export const insertUserSignedIn = userDetails =>
  new Promise((resolve, reject) => {
    Realm.open(UserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(USERS_SCHEMA, userDetails);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const fetchAllUsers = () =>
  new Promise((resolve, reject) => {
    Realm.open(UserdatabaseOptions)
      .then(realm => {
        const users = realm.objects(USERS_SCHEMA);
        resolve(users);
      })
      .catch(error => reject(error));
  });

export const deleteUserByToken = tokenId =>
  new Promise((resolve, reject) => {
    Realm.open(UserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.delete(realm.objectForPrimaryKey(USERS_SCHEMA, tokenId));
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteAllUsers = () =>
  new Promise((resolve, reject) => {
    Realm.open(UserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.deleteAll();
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const getActiveUser = () =>
  new Promise((resolve, reject) => {
    Realm.open(UserdatabaseOptions)
      .then(realm => {
        const users = realm.objects(USERS_SCHEMA);
        resolve(users.filtered('status == "active"'));
      })
      .catch(error => reject(error));
  });
