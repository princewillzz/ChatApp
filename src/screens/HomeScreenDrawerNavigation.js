import React from 'react';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import CustomHomeDrawerComponent from '../components/CustomHomeDrawerComponent';
import {Icon} from 'react-native-elements';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

const HomeScreenDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType="slide"
      drawerPosition="right"
      drawerContent={props => <CustomHomeDrawerComponent {...props} />}
      drawerStyle={{
        width: 80,
      }}>
      {/* Settings screen */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: '',
          drawerIcon: props => (
            <Icon name="settings-outline" type="ionicon" size={32} />
          ),
        }}
      />
      {/* Home Screen */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: '',
          drawerIcon: props => (
            <Icon name="home-outline" type="ionicon" size={32} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeScreenDrawerNavigation;
