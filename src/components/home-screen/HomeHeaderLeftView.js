import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar} from 'react-native-elements';

export default function HomeHeaderLeftView({handleOpenImageModal, image}) {
  return (
    <>
      <View style={styles.container}>
        {image ? (
          <TouchableOpacity onPress={() => handleOpenImageModal(image)}>
            <Avatar
              rounded
              source={{uri: image}}
              icon={{name: 'person-outline', type: 'ionicon', color: 'white'}}
              containerStyle={{backgroundColor: 'silver'}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Avatar
              rounded
              icon={{name: 'person-outline', type: 'ionicon', color: 'white'}}
              containerStyle={{backgroundColor: 'silver'}}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Chats</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minWidth: '100%',
    // backgroundColor: 'red',
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    // backgroundColor: 'yellow',
    minWidth: '100%',
    marginLeft: 10,
    paddingLeft: 5,
    fontSize: 22,
    fontWeight: '600',
    // textTransform: 'uppercase',
  },
});
