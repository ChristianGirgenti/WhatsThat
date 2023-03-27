import React, {Component } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Message from './message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class Conversation extends Component{

    constructor(props){
        super(props);

        this.state = {
            conversation: [],
            messages: [],
            message: "",
            error: ""
        }

        this.deleteMessage = this.deleteMessage.bind(this);
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.viewSingleChatDetail(this.props.route.params.chatId);
        })   
    }

    renderItem = ({item}) => {
        return <Message userName={item.author.first_name+" "+item.author.last_name} 
                        message={item.message} 
                        messageId = {item.message_id}
                        user_id={item.author.user_id} 
                        onPress={this.deleteMessage}
                        time={new Date(item.timestamp).toLocaleString()} 
                        navigation={this.props.navigation}
                        chatId = {this.props.route.params.chatId}
                />
    }

    clearErrorMessages() {
        this.setState({error: ""})
    }


    async deleteMessage(chatId, messageId){
        this.clearErrorMessages()

        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId+"/message/"+messageId, 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
        })
        .then(async (response) => { 
            if (response.status === 200) {
                this.viewSingleChatDetail(chatId)
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 404) throw "Message not found!"
            else if (response.status === 400) throw "You can't delete this message"
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }


    async send(chatId){
        this.clearErrorMessages();
        if (this.state.message === "")
        {
            this.setState({error: "Write something in the message box to send a message"})
            return
        }    
        let to_send = {
            message: this.state.message,
        };
        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId+"/message", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
            body: JSON.stringify(to_send)
        })
        .then(async (response) => { 
            if (response.status === 200) {
                this.setState({message: ""})
                this.viewSingleChatDetail(chatId)
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

    async viewSingleChatDetail(chatId) {
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId,
        {
            method: 'GET',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async (response) => {
            if (response.status === 200)
            {
                const responseJson = await response.json();
                this.setState({conversation: responseJson})
                this.setState({messages: this.state.conversation.messages.slice().reverse()})
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 403) throw "Cannot access this chat"
            else if (response.status === 404) {
                console.log("Chat not found");
                this.props.navigation.navigate("DisplayConversation")
            }
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError.toString()})
        })
    }

    updateTitle(chatId, conversationTitle){
        this.props.navigation.navigate("UpdateChatInformation" , {
            chatId: chatId,
            conversationTitle: conversationTitle
        })
    }

    render(){
        const {conversationTitle} = this.props.route.params;
        const {chatId} = this.props.route.params;
        return(
            <View style={GlobalStyle.mainContainer}>
                <View style={styles.titleSection}>
                    <NavigationHeaderWithIcon navigation={this.props.navigation} title={conversationTitle} />
                    <TouchableOpacity onPress={() => this.updateTitle(chatId, conversationTitle)}>
                        <Icon name="note-edit-outline" color={'black'} size={30} />
                    </TouchableOpacity>
                </View>

                <View style={GlobalStyle.wrapper}>
                    <FlatList 
                        data={this.state.messages}
                        renderItem={this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                </View>
                <>
                        {
                        this.state.error &&
                        <View style={[GlobalStyle.errorBox, styles.error]}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>   
                <View style={styles.sendMessageContainer}>
                    <TextInput
                        multiline={true} 
                        style={styles.messageBox} 
                        placeholder="Message" 
                        onChangeText={(message) => this.setState({message})} 
                        value={this.state.message}
                        maxLength={70}
                        />
                    <TouchableOpacity onPress={() => this.send(chatId)}>
                        <Icon name="send" color={'black'} size={40} />
                    </TouchableOpacity>
                </View>        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sendMessageContainer: {
        flex:2,
        flexDirection: 'row',
        backgroundColor: '#25D366',
        alignItems: 'stretch'
    },
    messageBox :{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        fontSize: 18,
        padding:6,
        textAlignVertical: 'top'
    },
    titleSection:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25D366',
    }
})

