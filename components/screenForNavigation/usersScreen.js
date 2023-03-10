import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyAccount from '../myAccount';
import EditAccount from '../editAccount';
import MyCamera from '../myCamera';
import SearchUsers from '../searchUsers';
import BlockedUsers from '../blockedUsers';

export default class UsersScreen extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
          <Stack.Screen name="SearchUsers" component={SearchUsers} options={{headerShown: false}}/>
          <Stack.Screen name="BlockedUsers" component={BlockedUsers} options={{headerShown: false}}/>
        </Stack.Navigator>    
    );  
  }
}




