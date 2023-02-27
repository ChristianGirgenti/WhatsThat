import React, { Component } from 'react';
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
        <Stack.Navigator>
          <Stack.Screen name="DisplayConversation" component={DisplayConversations} options={{headerShown: false}}/>
          <Stack.Screen name="Conversation" component={Conversation} options={{headerShown: false}}/>
        </Stack.Navigator>    
    );  
  }
}




