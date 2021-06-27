import Realm from 'realm';
import {RecentChatUsersSchema, RECENT_CHAT_USERS_SCHEMA} from './allSchemas';

const RecentChatUserdatabaseOptions = {
  path: 'untangledchat.recent_chat_users.realm',
  schema: [RecentChatUsersSchema],
  schemaVersion: 4,
};

export const fetchAllRecentChatUsers = () =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        const recentChatUsers = realm.objects(RECENT_CHAT_USERS_SCHEMA);
        resolve(recentChatUsers);
      })
      .catch(error => reject(error));
  });

export const saveRecentChatUserToDB = userDetails =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(RECENT_CHAT_USERS_SCHEMA, userDetails);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const removeAllRecentChats = () =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.deleteAll();
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const updateLastMessageAndCount = (
  username,
  message,
  activeChatingWithFriendId,
) =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)

      .then(realm => {
        realm.write(() => {
          // let objs = realm.objects(RECENT_CHAT_USERS_SCHEMA);
          let recentChatUser = realm
            .objects(RECENT_CHAT_USERS_SCHEMA)
            .filtered(`username == "${username}"`);

          if (recentChatUser.length > 0) {
            recentChatUser[0].last_unseen_msg = message;

            // console.log(recentChatUser[0].user_id, activeChatingWithFriendId);
            if (activeChatingWithFriendId !== recentChatUser[0].user_id)
              recentChatUser[0].unseen_msg_count += 1;
          }

          // console.log('last message', message);
          // console.log('user msg==> ', recentChatUser.last_unseen_msg);

          // objs[recentChatUser.id].last_unseen_msg = message;

          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const resetUnSeenMessageCount = user_id =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        let userChat = realm.objectForPrimaryKey(
          RECENT_CHAT_USERS_SCHEMA,
          user_id,
        );
        if (userChat.unseen_msg_count > 0) {
          realm.write(() => {
            userChat.unseen_msg_count = 0;
            resolve();
          });
        } else {
          resolve();
        }
      })
      .catch(e => reject(e));
  });

export const updateRecentChatUserInfo = friendsUserInfo =>
  new Promise((resolve, reject) => {
    Realm.open(RecentChatUserdatabaseOptions)
      .then(realm => {
        realm.write(() => {
          let recentChatUser = realm
            .objects(RECENT_CHAT_USERS_SCHEMA)
            .filtered(`username == "${friendsUserInfo.username}"`);
          if (recentChatUser.length > 0) {
            recentChatUser[0].username = friendsUserInfo.username;
            recentChatUser[0].displayName = friendsUserInfo.displayName;
            recentChatUser[0].user_image = friendsUserInfo.user_image;
            recentChatUser[0].last_updated = friendsUserInfo.last_updated;
            recentChatUser[0].rsa_public_key = friendsUserInfo.rsa_public_key;
          }
          resolve();
        });
      })
      .catch(e => {
        reject(e);
      });
  });

export const recentChatsSchemaRealmObject = new Realm(
  RecentChatUserdatabaseOptions,
);
