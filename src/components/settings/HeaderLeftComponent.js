import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

const HeaderLeftComponent = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back-outline" type="ionicon" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLeftComponent;
