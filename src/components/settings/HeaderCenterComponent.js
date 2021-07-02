import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function HeaderCenterComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
