import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import PreviewConversation from './previewConversation';
import NavigationHeader from './screenForNavigation/navigationHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class DisplayConversations extends Component{

    constructor(props){
        super(props);

        this.state = {
            conversationTitle: "",
            chatId: "",
            conversations: [],  
            error: "",
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({conversationTitle: ""})
            this.setState({conversations: []})
            this.viewAllChats();
        })   
    }


    async viewAllChats() {
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/chat",
        {
            method: 'GET',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async (response) => {
            if (response.status === 200)
            {
                const responseJson = await response.json();
                this.setState({conversations: responseJson})
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError.toString()})
        })
    }

    async create(){
        this.clearErrorMessages();       
        if (this.state.conversationTitle === "")
        {
            this.setState({error: "The conversation title can not be empty"})
            return
        }   
        let to_send = {
            name: this.state.conversationTitle,
          }; 
        return fetch("http://localhost:3333/api/1.0.0/chat", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
            body: JSON.stringify(to_send)
        })
        .then(async (response) => { 
            if (response.status === 201) {
                console.log("OK")
                const data = await response.json()
                this.props.navigation.navigate('Conversation', {
                    conversationTitle: this.state.conversationTitle,
                    chatId: data.chat_id,
                });

            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 400) throw "You can't create the new chat"
            else throw "Something went wrong while creating the new chat"
            })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }

    clearErrorMessages() {
        this.setState({error: ""})
      }

    renderItem = ({item}) => {
        console.log(item)
        return <PreviewConversation chatId={item.chat_id} name={item.name} lastMessage={item.last_message.message} 
                                    navigation={this.props.navigation} 
                                    lastMessageSenderFirstName={item.last_message.author ? item.last_message.author.first_name : null}
                                    lastMessageSenderLastName={item.last_message.author ? item.last_message.author.last_name : null}
                                    lastMessageTime={item.last_message.timestamp}
                                    />
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeader title="Conversations" />
                <View style={GlobalStyle.wrapper}>
                    <FlatList 
                        data={this.state.conversations}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                    <>
                        {
                        this.state.error &&
                        <View style={[GlobalStyle.errorBox, styles.error]}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>    
                    <View style={styles.newConversationContainer}>
                        <TextInput
                            style={styles.conversationTitleContainer}
                            value={this.state.conversationTitle}
                            onChangeText={(conversationTitle) => this.setState({conversationTitle})}
                            placeholder="Conversation Title..."
                        />
                        <TouchableOpacity onPress={() => this.create()}>
                                    <Icon name="chat-plus" color={'green'} size={40} />
                        </TouchableOpacity>
                    </View>
                </View>        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    newConversationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems:'flex-end',
        borderBottomWidth: 1,
        backgroundColor: '#90EE90',

    },
    conversationTitleContainer: {
        paddingLeft:10,
        paddingTop:5,
        paddingBottom:5,
        flexDirection: 'row',
        height: 40,
        width: '100%',
    },
    error: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    }
});