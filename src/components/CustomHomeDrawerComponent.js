import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import Animated from 'react-native-reanimated';
import AuthContext from '../auth/auth';

const CustomHomeDrawerComponent = props => {
  const {signOut} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        contentContainerStyle={styles.drawerContainer}
        {...props}>
        <DrawerItem
          style={styles.eachItem}
          label={''}
          icon={({color, size}) => (
            <Icon name="log-out-outline" type="ionicon" size={32} />
          )}
          onPress={signOut}
        />
        <DrawerItem
          style={styles.eachItem}
          label={''}
          icon={({color, size}) => (
            <Icon name="settings-outline" type="ionicon" size={32} />
          )}
          onPress={() => alert('comming soon')}
        />
        <DrawerItemList {...props} itemStyle={styles.eachItem} />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    // backgroundColor: 'black',
  },
  eachItem: {
    // backgroundColor: 'red',
    // flex: 1,
    // flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
});

export default CustomHomeDrawerComponent;
