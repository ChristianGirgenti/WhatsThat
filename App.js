import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './components/login';
import SignUpScreen from './components/signup';
import Contact from './components/contact';
import DisplayContacts from './components/displayContacts'
import PreviewConversation from './components/previewConversation';
import DisplayConversations from './components/displayConversation';
import Conversation from './components/conversation';
import Home from './components/home';

class App extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    
    );
    
  }
}

export default App

//CURRENT ISSUES:
//TOASTER NOT WORKING ON SIGN UP SUCCESS.
//HEADER DUPLICATES WHEN CLICKING ON A CONVERSATION PREVIEW

