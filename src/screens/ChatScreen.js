import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {sendTextMessageToUser} from '../api/message-api';
import AuthContext from '../auth/auth';
import ChatBox from '../components/ChatBox';
import ChatScreenHeaderLeft from '../components/ChatScreenHeaderLeft';
import ChatScreenHeaderRight from '../components/ChatScreenHeaderRight';
import ImageModal from '../components/ImageModal';
import {
  chatSchemaRealmObject,
  fethAllChatsSortedByDateForUser,
  insertChats,
} from '../db/chatsSchema';
import {
  resetUnSeenMessageCount,
  updateLastMessageAndCount,
} from '../db/recent_chat_users';
import {EnumMessageType} from '../utils/EnumMessageType';

export default function ChatScreen({route, navigation}) {
  const {currentUserInfo: meUserInfo} = React.useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({});

  // controlling chats to be loaded
  const [chats, setChats] = useState([]); // all chats

  const [noOfChatsToBeLoaded, setNoOfChatsToBeLoaded] = useState(9);
  const [refreshing, setRefreshing] = useState(false);

  const handleLoadMoreChat = async moreChats => {
    // console.log(noOfChatsToBeLoaded);
    setNoOfChatsToBeLoaded(noOfChatsToBeLoaded + moreChats);
  };

  // show image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const handleOpenImageModal = useCallback(() => {
    setShowImageModal(true);
  }, []);
  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  // end of show image modal

  const [textMessageToBeSent, setTextMessageToBeSent] = useState('');

  useEffect(() => {
    // deleteAllChats();

    const {userInfo} = route.params;

    let friendUserInfo = JSON.parse(userInfo);
    setUserInfo(friendUserInfo);
    fethAllChatsSortedByDateForUser(friendUserInfo?.username)
      .then(chats => setChats(chats))
      .catch(e => {
        console.log(e, 'Not loaded chats');
      });

    // add a listener to chatschema
    chatSchemaRealmObject.addListener('change', (newCollection, changes) => {
      // console.log('listened changes in chat');
      // console.log(newCollection, changes, chats.length);
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 0);

      handleLoadMoreChat(1);
    });

    // Mark all messages as seen
    setTimeout(() => {
      resetUnSeenMessageCount(friendUserInfo.user_id).catch(e =>
        console.log(e),
      );
    }, 0);

    return () => {
      chatSchemaRealmObject.removeAllListeners();
    };
  }, []);

  const handleSendMessage = async () => {
    const textChat = {
      uid: Math.random().toString(),
      textMessage: textMessageToBeSent.trim(),
      timestamp: new Date(),
      isMe: true,
      type: EnumMessageType.TEXT,
      send_to_id: userInfo?.username,
    };

    insertChats(textChat)
      .then(() => {
        updateLastMessageAndCount(
          userInfo?.username,
          textChat.textMessage,
          userInfo?.user_id,
        ).catch(e => console.log('last seen message update failed', e));
      })
      .catch(e => console.log(e));

    // sendTextMessageToFriend(textChat);

    sendTextMessageToUser(textChat, userInfo?.rsa_public_key).catch(e => {
      console.log(e);
    });

    setTextMessageToBeSent('');
  };

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={
          <ChatScreenHeaderLeft
            userImage={userInfo?.user_image}
            displayName={userInfo?.displayName}
            handleOpenImageModal={handleOpenImageModal}
            navigation={navigation}
          />
        }
        rightComponent={<ChatScreenHeaderRight />}
      />
      <KeyboardAvoidingView style={styles.container}>
        <FlatList
          style={styles.chatList}
          refreshing={refreshing}
          data={chats.slice(0, noOfChatsToBeLoaded)}
          renderItem={({item}) => (
            <ChatBox data={item} isMe={item.isMe} key={item.uid} />
          )}
          keyExtractor={_ => _.uid}
          onEndReached={() => handleLoadMoreChat(10)}
          onEndReachedThreshold={0.5}
          inverted
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            multiline
            style={styles.messageInput}
            placeholder="Enter Text"
            value={textMessageToBeSent}
            onChangeText={setTextMessageToBeSent}
            // onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendIcon}>
            <Icon name="send-outline" type="ionicon" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ImageModal
        handleCloseImageModal={handleCloseImageModal}
        showImageModal={showImageModal}
        images={{uri: userInfo?.user_image}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    marginVertical: 10,
  },
  messageInputContainer: {
    // height: 50,
    // maxWidth: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  messageInput: {
    // flexGrow: 1,
    width: '90%',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    maxHeight: 100,
    bottom: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    color: 'black',
  },
  sendIcon: {
    // backgroundColor: 'yellow',
    // flex: 1,
    alignSelf: 'flex-end',
    bottom: 18,
    // position: 'relative',
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
  },
});
