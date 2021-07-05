import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Button, ListItem} from 'react-native-elements';
import {Swipeable} from 'react-native-gesture-handler';
import {deleteChatForUser} from '../db/chatsSchema';
import {deleteRecentChatUser} from '../db/recent_chat_users';

export default React.memo(
  ({
    handleChangeActiveChatingWithFriendId,
    navigation,
    handleOpenImageModal,
    userInfo,
  }) => {
    // console.log(
    // userInfo.username,
    // userInfo.unseen_msg_count,
    // userInfo.last_unseen_msg,
    // 'recent chat',
    // );
    return (
      <Swipeable
        friction={2}
        overshootLeft={false}
        renderLeftActions={() => <LeftAction username={userInfo?.username} />}>
        <ListItem
          containerStyle={{elevation: 4}}
          bottomDivider
          onPress={() => {
            handleChangeActiveChatingWithFriendId(userInfo.user_id);
            navigation.push('Chat', {
              userInfo: JSON.stringify(userInfo),
            });
          }}>
          <View>
            {userInfo?.user_image ? (
              <TouchableOpacity
                onPress={() =>
                  userInfo.user_image &&
                  handleOpenImageModal(userInfo?.user_image)
                }>
                <Avatar
                  rounded
                  source={{
                    uri: userInfo?.user_image,
                  }}
                  containerStyle={{backgroundColor: 'silver'}}
                  title={userInfo?.displayName && userInfo?.displayName[0]}
                  icon={{name: 'person-outline', type: 'ionicon'}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Avatar
                  rounded
                  containerStyle={{backgroundColor: 'silver'}}
                  title={userInfo?.displayName && userInfo?.displayName[0]}
                  icon={{name: 'person-outline', type: 'ionicon'}}
                />
              </TouchableOpacity>
            )}

            <Badge
              value={
                userInfo?.unseen_msg_count > 0 && userInfo?.unseen_msg_count
              }
              status={userInfo?.unseen_msg_count > 0 && 'error'}
              containerStyle={{position: 'absolute', top: -4, right: -4}}
            />
          </View>

          <ListItem.Content>
            <ListItem.Title>{userInfo?.displayName}</ListItem.Title>
            <ListItem.Subtitle>
              {`${userInfo?.last_unseen_msg?.slice(0, 33)}${
                userInfo?.last_unseen_msg?.length > 33 ? '...' : ''
              }`}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron size={32} />
        </ListItem>
      </Swipeable>
    );
  },
);

const LeftAction = ({username}) => {
  const handleDeleteChat = async () => {
    try {
      await deleteChatForUser(username);
    } catch (error) {
      console.log(error);
    }

    try {
      await deleteRecentChatUser(username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      title="Delete"
      icon={{name: 'delete', color: 'white'}}
      buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
      onPress={handleDeleteChat}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
});
