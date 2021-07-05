import React, {useState} from 'react';
import Contacts from 'react-native-contacts';
import {Overlay, SpeedDial} from 'react-native-elements';
import {checkIfUsernameExistsAndFetchUsersInfo} from '../api/users-api';
import {
  saveRecentChatUserToDB,
  updateRecentChatUserInfo,
} from '../db/recent_chat_users';
import {constructProfilePhotoURIWithImageId} from '../services/utility-service';
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
          eachContact.phoneNumbers
            .map(contactNumber => {
              return {
                number: removeSpecialCharacterFromNumber(contactNumber.number),
                displayName: eachContact.displayName,
              };
            })
            .flatMap(eachContact => generateparsedContacts(eachContact)),
        )
        .filter(
          manipulatedContactInfo =>
            manipulatedContactInfo &&
            // !recentChatUsers.find(
            //   user => user.username === manipulatedContactInfo.number,
            // ) &&
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
            console.log(count);
            try {
              if (
                recentChatUsers.find(
                  user => user.username === contactUserInfo.username,
                )
              ) {
                console.log('Already present');
                await updateFriendsUserInfo(contactUserInfo, eachContact);
              } else {
                await saveFriendsInfoToDB(contactUserInfo, eachContact);
              }
            } catch (error) {
              console.log('error saving- ', error);
            }
            // console.log(++count);
            ++count >= contactsToBeSynced.length &&
              handleAllContactHasBeenSynced();
          })
          .catch(e => {
            console.log(e, count);
            ++count >= contactsToBeSynced.length &&
              handleAllContactHasBeenSynced();
          }),
      );
      if (contactsToBeSynced.length <= 0)
        setTimeout(() => {
          setIsLoading(false);
          setOpen(false);
        }, 1000);
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
      }, 1000),
    );
  };

  const removeSpecialCharacterFromNumber = contactNumber => {
    let number = '';
    let index = 0;
    if (contactNumber[0] === '+') index++;
    for (index = 0; index < contactNumber.length; index++) {
      if (contactNumber[index] >= '0' && contactNumber[index] <= '9')
        number += contactNumber[index];
    }
    return number;
  };

  const generateparsedContacts = contactInfo => {
    // 1st copy is with what he saved
    let contacts = [];
    console.log('For contact: => ', contactInfo.number);

    try {
      // if(contactInfo.number, contactInfo.displayName)
      if (contactInfo.number[0] !== '+') {
        const currentUsersCountryCode = currentUserInfo.country_code;
        let number = contactInfo.number;
        // 2nd copy
        contacts.push({
          ...contactInfo,
          number: '+' + currentUsersCountryCode + number,
        });

        // 3rd copy
        number = number.replace(currentUsersCountryCode, '');
        contacts.push({
          ...contactInfo,
          number: '+' + currentUsersCountryCode + number,
        });
      } else {
        contacts.push(contactInfo);
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(contacts);
    return contacts;
  };

  const saveFriendsInfoToDB = async (
    apiResponseUserInfo,
    usersContactBookInfo,
  ) => {
    const profile_img_uri = null;

    if (apiResponseUserInfo?.profile_picture) {
      profile_img_uri = constructProfilePhotoURIWithImageId(
        apiResponseUserInfo.profile_picture,
      );
    }

    const friendsUserInfo = {
      user_id: apiResponseUserInfo.id,
      username: apiResponseUserInfo.username,
      displayName: usersContactBookInfo.displayName,
      user_image: profile_img_uri,
      unseen_msg_count: 0,
      last_unseen_msg: '',
      last_updated: new Date(1),
      rsa_public_key: apiResponseUserInfo?.publicRSAKey,
    };
    saveRecentChatUserToDB(friendsUserInfo)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
  };

  const updateFriendsUserInfo = async (
    apiResponseUserInfo,
    usersContactBookInfo,
  ) => {
    let profile_img_uri = null;

    if (apiResponseUserInfo?.profile_picture) {
      profile_img_uri = constructProfilePhotoURIWithImageId(
        apiResponseUserInfo.profile_picture,
      );
    }

    console.log(profile_img_uri);
    const updatedFriendsUserInfo = {
      username: apiResponseUserInfo.username,
      displayName: usersContactBookInfo.displayName,
      user_image: profile_img_uri,
      last_updated: new Date(),
      rsa_public_key: apiResponseUserInfo?.publicRSAKey,
    };

    updateRecentChatUserInfo(updatedFriendsUserInfo).catch(e => console.log(e));
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
