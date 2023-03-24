import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DisplayConversations from '../displayConversations';
import Conversation from '../conversation';
import UpdateChatInformation from '../updateChatInformation';
import AddNewMembersToChat from '../addNewMembersToChat';

export default class ConversationScreen extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
          <Stack.Screen name="DisplayConversations" component={DisplayConversations} options={{headerShown: false}}/>
          <Stack.Screen name="Conversation" component={Conversation} options={{headerShown: false}}/>
          <Stack.Screen name="UpdateChatInformation" component={UpdateChatInformation} options={{headerShown: false}}/>
          <Stack.Screen name="AddNewMembersToChat" component={AddNewMembersToChat} options={{headerShown: false}}/>
        </Stack.Navigator>    
    );  
  }
}




