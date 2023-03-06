import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyAccount from '../myAccount';
import EditAccount from '../editAccount';
import MyCamera from '../myCamera';

export default class MyAccountScreen extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
          <Stack.Screen name="MyAccount" component={MyAccount} options={{headerShown: false}}/>
          <Stack.Screen name="EditAccount" component={EditAccount} options={{headerShown: false}}/>
          <Stack.Screen name="Camera" component={MyCamera} options={{headerShown: false}}/>
        </Stack.Navigator>    
    );  
  }
}




