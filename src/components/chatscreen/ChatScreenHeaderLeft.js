import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';

export default function ChatScreenHeaderLeft({
  navigation,
  handleOpenImageModal,
  userImage,
  displayName,
}) {
  const showDisplayname = () => {
    if (displayName?.length > 10) {
      return displayName.slice(0, 10) + '...';
    } else return displayName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.pop()}>
        <Icon name="arrow-back-outline" type="ionicon" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatingWithAvatar}
        onPress={userImage && handleOpenImageModal}>
        {userImage ? (
          <Avatar
            rounded
            source={{
              uri: userImage,
            }}
            containerStyle={{backgroundColor: 'silver'}}
            title={displayName && displayName[0]}
            icon={{name: 'person-outline', type: 'ionicon'}}
          />
        ) : (
          <Avatar
            rounded
            containerStyle={{backgroundColor: 'silver'}}
            title={displayName && displayName[0]}
            icon={{name: 'person-outline', type: 'ionicon'}}
          />
        )}
        <Text style={styles.chatWithName}>{showDisplayname()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
  },
  chatingWithAvatar: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  chatWithName: {
    marginLeft: 10,
    fontSize: 17,
    // backgroundColor: 'blue',
    minWidth: '100%',
  },
});
