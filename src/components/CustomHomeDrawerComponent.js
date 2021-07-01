import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-elements/dist';
import {Icon} from 'react-native-elements';
import AuthContext from '../auth/auth';

const CustomHomeDrawerComponent = props => {
  const {signOut} = useContext(AuthContext);

  const navigateToChatScreenWithChatBot = () => {
    console.log('Navigating');
    props.navigation.push('ChatBot');
  };

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
        <DrawerItemList {...props} itemStyle={styles.eachItem} />
        {/* Chat bot */}
        <DrawerItem
          style={[styles.eachItem, styles.chatbotContainer]}
          label={''}
          icon={({color, size}) => (
            // <Icon name="body" type="ionicon" size={32} />
            <Avatar
              rounded
              source={require('../assets/images/buddy3.png')}
              // containerStyle={{backgroundColor: 'silver'}}
              icon={{name: 'person-outline', type: 'ionicon'}}
              size={50}
            />
          )}
          onPress={navigateToChatScreenWithChatBot}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  drawerContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    // backgroundColor: 'black',
  },
  eachItem: {
    alignItems: 'flex-start',
  },
  chatbotContainer: {
    height: 70,
    justifyContent: 'center',
  },
});

export default CustomHomeDrawerComponent;
