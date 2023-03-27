import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlockedUsers from '../blockedUsers';
import DisplayContacts from '../displayContacts';

export default class ContactsScreen extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
          <Stack.Screen name="DisplayContacts" component={DisplayContacts} options={{headerShown: false}}/>
          <Stack.Screen name="BlockedUsers" component={BlockedUsers} options={{headerShown: false}}/>
        </Stack.Navigator>    
    );  
  }
}




