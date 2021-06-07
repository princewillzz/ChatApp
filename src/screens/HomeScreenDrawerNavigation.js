import React from 'react';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import CustomHomeDrawerComponent from '../components/CustomHomeDrawerComponent';
import {Icon} from 'react-native-elements';

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
