import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

export default React.memo(({navigation, handleOpenImageModal, userInfo}) => {
  console.log(userInfo);
  return (
    <ListItem
      bottomDivider
      onPress={() =>
        navigation.push('Chat', {
          userInfo: JSON.stringify(userInfo),
        })
      }>
      <TouchableOpacity
        onPress={() => handleOpenImageModal(userInfo?.user_image)}>
        <Avatar
          rounded
          source={{
            uri: userInfo?.user_image,
          }}
        />
      </TouchableOpacity>
      <ListItem.Content>
        <ListItem.Title>{userInfo?.username}</ListItem.Title>
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
