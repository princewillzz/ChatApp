import React, {useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {sendChatMessageToChatBot} from '../api/chatbot-api';
import AuthContext from '../auth/auth';
import ChatBox from '../components/ChatBox';
import LeftHeaderChatbotScreen from '../components/chatscreen/LeftHeaderChatbotScreen';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';

export default function ChatBotTalkScreen({route, navigation}) {
  const {currentUserInfo: meUserInfo} = React.useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // controlling chats to be loaded
  const [chats, setChats] = useState([]); // all chats

  const [textMessageToBeSent, setTextMessageToBeSent] = useState('');

  const handleSendMessage = async () => {
    setRefreshing(true);
    const textChat = {
      uid: uuid(),
      textMessage: textMessageToBeSent.trim(),
      timestamp: new Date(),
      isMe: true,
      type: 'text',
    };

    setChats(chats => {
      chats = [textChat, ...chats];
      return chats;
    });

    sendChatMessageToChatBot(textChat, meUserInfo.token_id)
      .then(messageInfo => {
        // console.log(messageInfo.reply);
        const replyTextChat = {
          uid: uuid(),
          textMessage: messageInfo?.reply?.trim(),
          timestamp: new Date(),
          isMe: false,
          type: 'text',
        };
        setChats(chats => {
          chats = [replyTextChat, ...chats];
          return chats;
        });
      })
      .catch(e => console.log(e))
      .finally(() => {
        setRefreshing(false);
      });

    setTextMessageToBeSent('');
  };

  useEffect(() => {
    setChats([
      {
        uid: uuid(),
        textMessage: `What's up man?`.trim(),
        timestamp: new Date(),
        isMe: false,
        type: 'text',
      },
    ]);

    setUserInfo({
      user_image: require('../assets/images/buddy3.png'),
      displayName: 'Griffny',
    });
  }, []);

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: '#ECECEC',
        }}
        leftComponent={
          <LeftHeaderChatbotScreen
            userImage={userInfo?.user_image}
            displayName={userInfo?.displayName}
            navigation={navigation}
          />
        }
        // rightComponent={<ChatScreenHeaderRight />}
      />
      <KeyboardAvoidingView style={styles.container}>
        <FlatList
          inverted
          style={styles.chatList}
          data={chats}
          renderItem={({item}) => (
            <ChatBox data={item} isMe={item.isMe} key={item.uid} />
          )}
          keyExtractor={_ => _.uid}
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
