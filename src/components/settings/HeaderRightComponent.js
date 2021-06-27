import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

export default function HeaderRightComponent({navigation}) {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="ellipsis-vertical-outline" type="ionicon" />
      </TouchableOpacity>
    </View>
  );
}
