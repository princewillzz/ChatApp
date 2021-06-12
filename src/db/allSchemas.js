export const USERS_SCHEMA = 'users';
export const RECENT_CHAT_USERS_SCHEMA = 'recent_chat_users';
export const CHATS_SCHEMA = 'chats_schema';

export const UsersSchema = {
  name: USERS_SCHEMA,
  primaryKey: 'token_id',
  properties: {
    token_id: 'string',
    loggedAt: 'string',
    status: 'string',
  },
};

export const RecentChatUsersSchema = {
  name: RECENT_CHAT_USERS_SCHEMA,
  primaryKey: 'user_id',
  properties: {
    user_id: 'string',
    displayName: 'string',
    username: 'string',
    user_image: 'string?',
    unseen_msg_count: 'int?',
    last_unseen_msg: 'string?',
    last_updated: 'date',
  },
};

export const ChatsSchema = {
  name: CHATS_SCHEMA,
  primaryKey: 'uid',
  properties: {
    uid: 'string',
    type: 'string',
    text: 'string?',
    link: 'string?',
    timestamp: 'date',
    // Is me
    isMe: 'bool?',
    // sent info
    send_to_id: 'string',
  },
};
