import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import DisplayContacts from './displayContacts';
import DisplayConversations from './displayConversation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

export default class Home extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return(
            <Tab.Navigator
                screenOptions={{
                    tabBarInactiveTintColor: '#a3a3a3',
                    tabBarActiveTintColor: 'black',      
                }}
            >
                <Tab.Screen name="Conversations" component={DisplayConversations} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="chat" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="Contacts" component={DisplayContacts} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="contacts" color={color} size={26} />
                    )
                }} />
            </Tab.Navigator>
        )
    }
}

