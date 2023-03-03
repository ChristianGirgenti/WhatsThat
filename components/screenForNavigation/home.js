import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import DisplayContacts from '../displayContacts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ConversationScreen from './conversationScreen';
import MyAccount from '../myAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAccountScreen from './myAccountScreen';

const Tab = createBottomTabNavigator();

export default class Home extends Component{

    //TO CHECK THE COMPONENT DID MOUNT THING THAT EVEN IF I DELETE THE TOKEN IT STILL SWAPP
    //THROUGH THE WINDOWS
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        if (value == null) this.props.navigation.navigate('Login');
    }


    render(){
        return(
            <Tab.Navigator
                screenOptions={{
                    tabBarInactiveTintColor: '#a3a3a3',
                    tabBarActiveTintColor: 'black',  
                    headerShown: false    
                }}
            >
                <Tab.Screen name="Conversations" component={ConversationScreen} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="chat" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="Contacts" component={DisplayContacts} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="contacts" color={color} size={26} />
                    )
                }} />

                <Tab.Screen name="My Account" component={MyAccountScreen} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="account-cog" color={color} size={26} />
                    )
                }} />
            </Tab.Navigator>
        )
    }
}

