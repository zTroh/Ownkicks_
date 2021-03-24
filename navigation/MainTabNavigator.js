import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon, {UserProfile} from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AuthenticateScreen from '../screens/AuthenticateScreen';
import InboxScreen from '../screens/InboxScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'home' : 'home'}
    />
  ),
};

HomeStack.path = '';

const AuthenticateStack = createStackNavigator(
  {
    Authenticate: AuthenticateScreen,
  },
  config
);

AuthenticateStack.navigationOptions = {
  tabBarLabel: 'Authenticate',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'shopping-bag' : 'shopping-bag'} />
  ),
};

AuthenticateStack.path = '';

const InboxStack = createStackNavigator(
  {
    Inbox: InboxScreen,
  },
  config
);

InboxStack.navigationOptions = {
  tabBarLabel: 'Inbox',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'inbox' ? 'inbox' : 'inbox'} />
  ),
};

InboxStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  AuthenticateStack,
  InboxStack,
});

tabNavigator.path = '';

export default tabNavigator;
