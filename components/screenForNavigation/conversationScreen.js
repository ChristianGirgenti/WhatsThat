import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DisplayConversations from '../displayConversation';
import Conversation from '../conversation';

export default class ConversationScreen extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer independent="true" >
        <Stack.Navigator>
          <Stack.Screen name="DisplayConversation" component={DisplayConversations} options={{headerShown: false}}/>
          <Stack.Screen name="Conversation" component={Conversation} />
        </Stack.Navigator>
      </NavigationContainer>
    
    );  
  }
}




