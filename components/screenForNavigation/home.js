import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversationScreen from './conversationScreen';
import MyAccountScreen from './myAccountScreen';
import SearchUsers from '../searchUsers';
import ContactsScreen from './contactScreen';

const Tab = createBottomTabNavigator();

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  componentDidMount() {
    this.unsubscribe = this.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) this.navigation.navigate('Login');
  };

  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: '#a3a3a3',
          tabBarActiveTintColor: 'black',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Conversations"
          component={ConversationScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="chat" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="contacts" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchUsers}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="magnify" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="My Account"
          component={MyAccountScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="account-cog" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
