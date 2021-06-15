import React from 'react';
import {View} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem, Badge} from 'react-native-elements';

export default React.memo(
  ({
    handleChangeActiveChatingWithFriendId,
    navigation,
    handleOpenImageModal,
    userInfo,
  }) => {
    // console.log(userInfo);
    return (
      <ListItem
        bottomDivider
        onPress={() => {
          handleChangeActiveChatingWithFriendId(userInfo.user_id);
          navigation.push('Chat', {
            userInfo: JSON.stringify(userInfo),
          });
        }}>
        <TouchableOpacity
          onPress={() =>
            userInfo.user_image && handleOpenImageModal(userInfo?.user_image)
          }>
          {userInfo?.user_image ? (
            <Avatar
              rounded
              source={{
                uri: userInfo?.user_image,
              }}
              containerStyle={{backgroundColor: 'silver'}}
              title={userInfo?.displayName && userInfo?.displayName[0]}
              icon={{name: 'person-outline', type: 'ionicon'}}
            />
          ) : (
            <View>
              <Avatar
                rounded
                containerStyle={{backgroundColor: 'silver'}}
                title={userInfo?.displayName && userInfo?.displayName[0]}
                icon={{name: 'person-outline', type: 'ionicon'}}
              />
              <Badge
                value={
                  userInfo?.unseen_msg_count > 0 && userInfo?.unseen_msg_count
                }
                status={userInfo?.unseen_msg_count > 0 && 'error'}
                containerStyle={{position: 'absolute', top: -4, right: -4}}
              />
            </View>
          )}
        </TouchableOpacity>
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
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
});
