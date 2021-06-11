import React from 'react';
import Contacts from 'react-native-contacts';
import {FAB, Icon} from 'react-native-elements';
import {checkIfUsernameExistsAndFetchUsersInfo} from '../api/users-api';
import {
  removeAllRecentChats,
  saveRecentChatUserToDB,
} from '../db/recent_chat_users';

const CustomBottonFloatingSyncButton = ({currentUserInfo, recentChatUsers}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // sync contacts
  const handleSyncContacts = async () => {
    setIsLoading(true);
    removeAllRecentChats();
    try {
      const contacts = await Contacts.getAll();

      const allPhoneNumbers = contacts.flatMap(contact =>
        contact.phoneNumbers.map(c =>
          removeSpecialCharacterFromNumber(c.number),
        ),
      );

      const contactToBeSynced = allPhoneNumbers.filter(
        phoneNumber =>
          !recentChatUsers.find(user => user.username === phoneNumber),
      );

      const allPromises = contactToBeSynced
        .filter(contact => contact && contact !== currentUserInfo?.username)
        .map(contact =>
          checkIfUsernameExistsAndFetchUsersInfo(
            contact,
            currentUserInfo.token_id,
          )
            .then(userInfo => {
              saveFriendsInfoToDB(userInfo)
                .catch(() => {})
                .finally(() =>
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 1000),
                );
            })
            .catch(e => {
              console.log(e);
              setIsLoading(false);
            }),
        );

      Promise.all(allPromises);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const removeSpecialCharacterFromNumber = contactNumber => {
    let number = '';
    for (let index = 0; index < contactNumber.length; index++) {
      if (contactNumber[index] >= '0' && contactNumber[index] <= '9')
        number += contactNumber[index];
    }
    return number;
  };

  const saveFriendsInfoToDB = async userInfo => {
    const friendsUserInfo = {
      user_id: userInfo.id,
      username: userInfo.username,
      user_image: userInfo?.image,
      unseen_msg_count: 0,
      last_updated: new Date(1),
    };
    saveRecentChatUserToDB(friendsUserInfo)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <FAB
      color="#CCE5FF"
      icon={() => <Icon name="add" type="ionicon" />}
      placement="right"
      style={{padding: 5}}
      onPress={handleSyncContacts}
      loading={isLoading}
    />
  );
};

export default CustomBottonFloatingSyncButton;
