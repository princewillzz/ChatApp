import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Contacts from 'react-native-contacts';
import {FAB, Icon, Overlay} from 'react-native-elements';
import {checkIfUserListExistsAndFetchUsersInfo} from '../../api/users-api';
import {
  saveRecentChatUserToDB,
  updateRecentChatUserInfo,
} from '../../db/recent_chat_users';
import {constructProfilePhotoURIWithImageId} from '../../services/utility-service';
import {allAppColors} from '../../utils/colors';
import CustomSyncInfoModal from '../CustomSyncInfoModal';

const CustomBottonFloatingSyncButton = ({
  currentUserInfo,
  recentChatUsers,
  handleContactSuccessfullySynced,
  startSyncingBoolean,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAllContactHasBeenSynced = () => {
    // console.log('congo');
    handleContactSuccessfullySynced(() =>
      setTimeout(() => {
        setIsLoading(false);
        setOpen(false);
      }, 500),
    );
  };

  // sync contacts

  const handleSyncContacts = async () => {
    setIsLoading(true);
    try {
      await actuallyHandleContactSync();
    } catch (error) {
      console.log('Error While syncing', error);
    }
    handleAllContactHasBeenSynced();
  };

  const actuallyHandleContactSync = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // number, displayName
        const contactsToBeSynced = await getParsedAndProcessedContacts();
        // Create a hashmap of recentchatuser with username as key and index in array as value
        const recentChatUsersMap = new Map();
        recentChatUsers.forEach((contact, index) =>
          recentChatUsersMap.set(contact.username, index),
        );
        // Create a hashmap of contact to be synced with username as key and index in array as value
        // Also create a list of username string to be synced
        const contactsToBeSyncedMap = new Map();
        const usernameList = contactsToBeSynced.map((contact, index) => {
          contactsToBeSyncedMap.set(contact.number, index);
          return contact.number;
        });

        // Fetch contacts info from the server
        const syncedContacts = await checkIfUserListExistsAndFetchUsersInfo(
          usernameList,
          currentUserInfo.token_id,
        );
        syncedContacts.forEach((syncedContactUserInfo, indexSync) => {
          if (recentChatUsersMap.has(syncedContactUserInfo.username)) {
            let index = contactsToBeSyncedMap.get(
              syncedContactUserInfo.username,
            );
            // console.log('Update: ', syncedContactUserInfo.username);
            updateFriendsUserInfo(
              syncedContactUserInfo,
              contactsToBeSynced[index],
            ).catch(e => console.log(e));
          } else {
            let index = contactsToBeSyncedMap.get(
              syncedContactUserInfo.username,
            );
            // console.log('save: ', syncedContactUserInfo.username);
            saveFriendsInfoToDB(
              syncedContactUserInfo,
              contactsToBeSynced[index],
            ).catch(e => console.log(e));
          }
          if (indexSync === syncedContacts.length - 1) {
            // setTimeout(() => {
            // handleAllContactHasBeenSynced();
            resolve();
            // }, 0);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   *
   * @returns list of contacts object
   */
  const getParsedAndProcessedContacts = async () => {
    const contacts = await Contacts.getAll();
    // filter and manipulate contact info that are required
    let contactsToBeSynced = contacts
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

    // console.log('with duplicates =====>');
    // contactsToBeSynced.forEach(i => console.log(i));
    contactsToBeSynced = await removeAllDuplicateNumbers(contactsToBeSynced);
    // console.log('without duplicates =====>');
    // contactsToBeSynced.forEach(i => console.log(i));

    return contactsToBeSynced;
  };

  const removeAllDuplicateNumbers = async contacts => {
    let seen = {};

    return contacts.filter(item => {
      return seen.hasOwnProperty(item.number)
        ? false
        : (seen[item.number] = true);
    });
  };

  const removeSpecialCharacterFromNumber = contactNumber => {
    let number = '';
    let index = 0;
    if (contactNumber[0] === '+') index++;
    for (index = 0; index < contactNumber.length; index++) {
      if (contactNumber[index] >= '0' && contactNumber[index] <= '9')
        number += contactNumber[index];
    }
    // for (let i = 0; i < 10000; i++) {
    //   console.log('hii');
    // }
    return number;
  };

  const generateparsedContacts = contactInfo => {
    // 1st copy is with what he saved
    let contacts = [];
    // console.log('For contact: => ', contactInfo.number);

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
    let profile_img_uri = null;

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

    // console.log(profile_img_uri);
    const updatedFriendsUserInfo = {
      username: apiResponseUserInfo.username,
      displayName: usersContactBookInfo.displayName,
      user_image: profile_img_uri,
      last_updated: new Date(),
      rsa_public_key: apiResponseUserInfo?.publicRSAKey,
    };

    updateRecentChatUserInfo(updatedFriendsUserInfo).catch(e => console.log(e));
  };

  React.useEffect(() => {
    if (startSyncingBoolean) {
      actuallyHandleContactSync().catch(e => {
        console.log(e);
      });
      const syncOnce = setInterval(async () => {
        try {
          if (recentChatUsers.length > 0) {
            await actuallyHandleContactSync();
          }
        } catch (error) {
          console.log(error);
        }
      }, 1000 * 60 * 1);

      return () => {
        clearInterval(syncOnce);
      };
    }
  }, [recentChatUsers, startSyncingBoolean]);

  const [open, setOpen] = useState(false);
  return (
    <>
      <FAB
        buttonStyle={styles.circleButton}
        style={styles.fabStyle}
        color={allAppColors.primaryBlue}
        icon={() => <Icon name="sync-outline" type="ionicon" />}
        placement="right"
        onPress={handleSyncContacts}
        loading={isLoading}
      />

      {/* <SpeedDial
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
      </SpeedDial> */}

      <Overlay visible={isLoading} ModalComponent={CustomSyncInfoModal} />
    </>
  );
};

export default CustomBottonFloatingSyncButton;

const styles = StyleSheet.create({
  fabStyle: {
    padding: 4,
  },
  circleButton: {
    borderRadius: 50,
  },
});
