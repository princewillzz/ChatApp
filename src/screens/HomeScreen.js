import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Header, Icon, ListItem} from 'react-native-elements';
import {messagingWebsocketConnectionURI} from '../../config';
import {initilizeWebsocketObject} from '../api/message-api';
import AuthContext from '../auth/auth';
import CustomBottonFloatingSyncButton from '../components/home-screen/CustomBottonFloatingSyncButton';
import HomeHeaderLeftView from '../components/home-screen/HomeHeaderLeftView';
import HomeHeaderRightView from '../components/home-screen/HomeHeaderRightView';
import ImageModal from '../components/ImageModal';
import RecentChat from '../components/home-screen/RecentChat';
import SearchBox from '../components/SearchBox';
import {insertChats} from '../db/chatsSchema';
import {
  fetchAllRecentChatUsers,
  recentChatsSchemaRealmObject,
  updateLastMessageAndCount,
} from '../db/recent_chat_users';
import {
  decryptTestMessage,
  generateRsaKeys,
  initiateRSAKeysInitialization,
  reInitializeKeysSaveAndSyncIt,
  saveGeneratedRSAKeys,
} from '../security/RSAEncryptionService';
import {EnumMessageType} from '../utils/EnumMessageType';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {allAppColors} from '../utils/colors';

export default function HomeScreen({navigation}) {
  const {currentUserInfo, signOut} = React.useContext(AuthContext);

  const [recentChatUsers, setRecentChatUsers] = useState([]);

  // search feature
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchResultUsers, setSearchResultUsers] = useState([]);
  // seach text
  const [seachChatText, setSearchChatText] = useState(null);

  // Zoom on the profile picture of all your contact
  const [imageToBeShownOnModal, setImageToBeShownOnModal] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handleOpenImageModal = useCallback(image => {
    setShowImageModal(true);
    setImageToBeShownOnModal(image);
  }, []);

  // Search box
  const toggleShowSearchBox = state => {
    if (showSearchBox !== state) {
      setShowSearchBox(state);
      if (!state) {
        setSearchChatText(null);
      }
    }
  };

  // handle Search
  const handleSearchOnChange = value => {
    setSearchChatText(value);

    setSearchResultUsers(
      recentChatUsers.filter(user =>
        user.displayName.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const [refreshingRecentFlatList, setRefreshingRecentFlatList] =
    useState(false);

  useEffect(() => {
    loadRecentChatUserFromTheDataStore();

    initiateRSAKeysInitialization(currentUserInfo.username)
      .catch(async e => {
        let erroredOut = true;
        while (erroredOut) {
          try {
            await reInitializeKeysSaveAndSyncIt(
              currentUserInfo.username,
              currentUserInfo.token_id,
            );
            erroredOut = false;
          } catch (error) {
            console.log('Errored out');
            erroredOut = true;
          }
        }
      })
      .finally(() => {
        setTimeout(() => {
          initiateWebsocketConnection();
        }, 1000);

        recentChatsSchemaRealmObject.addListener('change', () => {
          setRefreshingRecentFlatList(true);
          setTimeout(() => {
            setRefreshingRecentFlatList(false);
          }, 0);
        });
      });

    // removeAllRecentChats();
    return () => {
      console.log('Fucking home');
      unsubscribe();
    };
  }, []);

  const websocket = useRef(null);

  const initiateWebsocketConnection = useCallback(async () => {
    websocket.current = new WebSocket(
      `${messagingWebsocketConnectionURI}?token=${currentUserInfo.token_id}`,
    );
    initilizeWebsocketObject(websocket.current);
    websocket.current.onopen = handleOnMessageWebsocketOpen;
    websocket.current.onmessage = handleOnMessageWebsocketMessageReceived;
    websocket.current.onerror = handleOnMessageWebsocketError;
    websocket.current.onclose = handleOnMessageWebsocketClose;
  }, []);

  const handleOnMessageWebsocketOpen = useCallback(async () => {
    console.log('Connected');
  }, []);

  const handleOnMessageWebsocketMessageReceived = useCallback(async e => {
    const messageReceived = JSON.parse(e.data);
    // console.log(typeof messageReceived, messageReceived.sentBy);

    try {
      let decodedMsg = null;
      if (messageReceived.type === EnumMessageType.TEXT)
        decodedMsg = await decryptTestMessage(messageReceived.message);
      else throw new Error('Unacceptable Message Type');

      const chatMessage = {
        uid: uuid(),
        textMessage: decodedMsg,
        timestamp: new Date(),
        isMe: false,
        type: messageReceived.type,
        send_to_id: messageReceived.sentBy,
      };

      // console.log(chatMessage.textMessage);
      insertChats(chatMessage)
        .then(() => {
          if (messageReceived.type === EnumMessageType.TEXT)
            updateLastMessageAndCount(
              chatMessage.send_to_id,
              chatMessage.textMessage,
              activeChatingWithFriendId.current,
            ) // .then(() => console.log('message: ', chatMessage.textMessage))
              .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }, []);

  // on Error out of the websocket
  const handleOnMessageWebsocketError = useCallback(async e => {
    console.log('Errored out', e);
    console.log('Connecting again...');

    if (e?.message?.includes('401 Unauthorized')) {
      signOut();
    } else {
      setTimeout(() => {
        initiateWebsocketConnection();
      }, 2000);
    }
  }, []);

  // Disconnect the websocket
  const handleDisconnectMessagingWebsocket = useCallback(async () => {
    // console.log(websocket.current);
    if (websocket.current) websocket.current.close();
  }, []);

  // On websocket gets disconnected
  const handleOnMessageWebsocketClose = useCallback(async e => {
    console.log('Disconnected', e);
  }, []);

  const loadRecentChatUserFromTheDataStore = async callback => {
    fetchAllRecentChatUsers()
      .then(recentChatUsers => setRecentChatUsers(recentChatUsers))
      .catch(e => console.log(e))
      .finally(() => {
        if (typeof callback === 'function') callback();
      });
  };

  const activeChatingWithFriendId = useRef(null);

  const handleChangeActiveChatingWithFriendId = userId => {
    activeChatingWithFriendId.current = userId;
    // console.log(userId);
  };

  const unsubscribe = navigation.addListener('focus', () => {
    handleChangeActiveChatingWithFriendId(null);

    handleDisconnectMessagingWebsocket();
    recentChatsSchemaRealmObject.removeAllListeners();
    // websocket.current = null;
    activeChatingWithFriendId.current = null;
  });

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: allAppColors.primaryGreySilver,
        }}
        leftComponent={
          <HomeHeaderLeftView
            image={currentUserInfo?.image}
            handleOpenImageModal={handleOpenImageModal}
          />
        }
        leftContainerStyle={styles.leftHeaderComponent}
        rightComponent={
          <HomeHeaderRightView
            navigation={navigation}
            showSearchBox={showSearchBox}
            toggleShowSearchBox={toggleShowSearchBox}
          />
        }
      />

      {showSearchBox && (
        <SearchBox
          handleSearchOnChange={handleSearchOnChange}
          seachChatText={seachChatText}
          toggleShowSearchBox={toggleShowSearchBox}
        />
      )}

      <View
        style={styles.container}
        onTouchStart={() => toggleShowSearchBox(false)}>
        {/* If no contact was found show this alert message */}
        {recentChatUsers?.length <= 0 && (
          <ListItem
            style={styles.NoRecetChatsContainer}
            containerStyle={{
              backgroundColor: allAppColors.primaryBlue,
            }}
            bottomDivider>
            <ListItem.Content
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="alert-circle-outline"
                type="ionicon"
                style={{marginRight: 5}}
              />
              <ListItem.Title>No Recent Chats!!</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}

        {/* show list of users */}
        {!seachChatText ? (
          <FlatList
            style={styles.recentChats}
            data={recentChatUsers}
            renderItem={({item}) => (
              <RecentChat
                handleChangeActiveChatingWithFriendId={
                  handleChangeActiveChatingWithFriendId
                }
                handleOpenImageModal={handleOpenImageModal}
                navigation={navigation}
                userInfo={item}
                key={item.user_id}
              />
            )}
            refreshing={refreshingRecentFlatList}
            keyExtractor={_ => _.user_id}
          />
        ) : (
          <>
            {/* list of searched users */}
            <FlatList
              style={styles.recentChats}
              data={searchResultUsers}
              renderItem={({item}) => (
                <RecentChat
                  handleOpenImageModal={handleOpenImageModal}
                  navigation={navigation}
                  userInfo={item}
                  key={item.user_id}
                />
              )}
              keyExtractor={_ => _.user_id}
            />
            {/* Alert messag on Nothing found */}
            {searchResultUsers?.length <= 0 && (
              <ListItem
                style={styles.nothingFoundSearch}
                containerStyle={{
                  backgroundColor: allAppColors.primaryGreySilver,
                }}
                bottomDivider>
                <ListItem.Content
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="alert-circle-outline"
                    type="ionicon"
                    style={{marginRight: 5}}
                  />
                  <ListItem.Title>Nothing Found</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
          </>
        )}
      </View>

      <CustomBottonFloatingSyncButton
        currentUserInfo={currentUserInfo}
        recentChatUsers={recentChatUsers}
        handleContactSuccessfullySynced={loadRecentChatUserFromTheDataStore}
      />

      <ImageModal
        images={{uri: imageToBeShownOnModal}}
        showImageModal={showImageModal}
        handleOpenImageModal={handleOpenImageModal}
        handleCloseImageModal={handleCloseImageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  leftHeaderComponent: {
    minWidth: '35%',
  },
  NoRecetChatsContainer: {
    elevation: 4,
    position: 'absolute',
    width: '100%',
  },
  NoRecetChatsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#596998',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recentChats: {
    flex: 1,
    // backgroundColor: "blue",
    // flexDirection: "column",
  },
  searchBarContainer: {
    elevation: 30,
    top: 0,
  },
  searchBar: {
    width: '95%',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    // backgroundColor: "silver",
  },
  nothingFoundSearch: {
    position: 'absolute',
    width: '100%',
  },
});
