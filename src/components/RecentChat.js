import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

export default React.memo(({navigation, handleOpenImageModal, userInfo}) => {
  // console.log(userInfo);
  return (
    <ListItem
      bottomDivider
      onPress={() =>
        navigation.push('Chat', {
          userInfo: JSON.stringify(userInfo),
        })
      }>
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
          <Avatar
            rounded
            containerStyle={{backgroundColor: 'silver'}}
            title={userInfo?.displayName && userInfo?.displayName[0]}
            icon={{name: 'person-outline', type: 'ionicon'}}
          />
        )}
      </TouchableOpacity>
      <ListItem.Content>
        <ListItem.Title>{userInfo?.displayName}</ListItem.Title>
        <ListItem.Subtitle>Some chat</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron size={32} />
    </ListItem>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
});
