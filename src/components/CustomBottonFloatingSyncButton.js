import React, {useState} from 'react';
import Contacts from 'react-native-contacts';
import {Overlay, SpeedDial} from 'react-native-elements';
import {checkIfUsernameExistsAndFetchUsersInfo} from '../api/users-api';
import {saveRecentChatUserToDB} from '../db/recent_chat_users';
import CustomSyncInfoModal from './CustomSyncInfoModal';

const CustomBottonFloatingSyncButton = ({
  currentUserInfo,
  recentChatUsers,
  handleContactSuccessfullySynced,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // sync contacts
  const handleSyncContacts = async () => {
    setIsLoading(true);

    try {
      // read all contacts from the phone contact book
      const contacts = await Contacts.getAll();
      // filter and manipulate contact info that are required
      const contactsToBeSynced = contacts
        .flatMap(eachContact =>
          eachContact.phoneNumbers.map(contactNumber => {
            return {
              number: removeSpecialCharacterFromNumber(contactNumber.number),
              displayName: eachContact.displayName,
            };
          }),
        )
        .filter(
          manipulatedContactInfo =>
            manipulatedContactInfo &&
            !recentChatUsers.find(
              user => user.username === manipulatedContactInfo.number,
            ) &&
            currentUserInfo.username !== manipulatedContactInfo.number,
        );

      // process the contacts to be synced and store in the db
      // contactsToBeSynced.forEach(c => console.log(c));

      let count = 0;
      contactsToBeSynced.map(eachContact =>
        checkIfUsernameExistsAndFetchUsersInfo(
          eachContact.number,
          currentUserInfo.token_id,
        )
          .then(async contactUserInfo => {
            try {
              await saveFriendsInfoToDB(contactUserInfo, eachContact);
            } catch (error) {
              console.log('error saving- ', error);
            }
            // console.log(++count);
            ++count >= contactsToBeSynced.length &&
              handleAllContactHasBeenSynced();
          })
          .catch(e => {
            // console.log(e, ++count);
            ++count >= contactsToBeSynced.length &&
              handleAllContactHasBeenSynced();
          }),
      );
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAllContactHasBeenSynced = () => {
    console.log('congo');
    handleContactSuccessfullySynced(() =>
      setTimeout(() => {
        setIsLoading(false);
        setOpen(false);
      }, 5000),
    );
  };

  const removeSpecialCharacterFromNumber = contactNumber => {
    let number = '';
    for (let index = 0; index < contactNumber.length; index++) {
      if (contactNumber[index] >= '0' && contactNumber[index] <= '9')
        number += contactNumber[index];
    }
    return number;
  };

  const saveFriendsInfoToDB = async (
    apiResponseUserInfo,
    usersContactBookInfo,
  ) => {
    const friendsUserInfo = {
      user_id: apiResponseUserInfo.id,
      username: apiResponseUserInfo.username,
      displayName: usersContactBookInfo.displayName,
      user_image: apiResponseUserInfo?.image,
      unseen_msg_count: 0,
      last_updated: new Date(1),
    };
    saveRecentChatUserToDB(friendsUserInfo)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
  };

  // useEffect(() => {
  //   removeAllRecentChats();
  // }, []);

  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <FAB
        color="#CCE5FF"
        icon={() => <Icon name="add" type="ionicon" />}
        placement="right"
        style={{padding: 5}}
        onPress={handleSyncContacts}
        loading={isLoading}
      /> */}

      <SpeedDial
        color={'#CCE5FF'}
        isOpen={open}
        containerStyle={{margin: 5}}
        icon={{name: 'add', type: 'ionicon'}}
        openIcon={{name: 'close', type: 'ionicon'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        loading={isLoading}>
        <SpeedDial.Action
          color="pink"
          icon={{
            name: 'sync-outline',
            type: 'ionicon',
          }}
          title={isLoading ? 'Syncing' : 'Sync contacts'}
          loading={isLoading}
          onPress={handleSyncContacts}
        />
      </SpeedDial>

      <Overlay visible={isLoading} ModalComponent={CustomSyncInfoModal} />
    </>
  );
};

export default CustomBottonFloatingSyncButton;
