import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';

export default function LeftHeaderChatbotScreen({
  navigation,
  userImage,
  displayName,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.pop()}>
        <Icon name="arrow-back-outline" type="ionicon" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.chatingWithAvatar}>
        <Avatar
          rounded
          source={userImage}
          containerStyle={{backgroundColor: 'silver'}}
          title={displayName && displayName[0]}
          icon={{name: 'person-outline', type: 'ionicon'}}
        />
        <Text style={styles.chatWithName}>{displayName}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
  },
});
