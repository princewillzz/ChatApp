export const USERS_SCHEMA = 'users';

export const UsersSchema = {
  name: USERS_SCHEMA,
  primaryKey: 'token_id',
  properties: {
    token_id: 'string',
    loggedAt: 'string',
    status: 'string',
  },
};
