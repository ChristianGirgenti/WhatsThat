import React, {Component } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput} from 'react-native';
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
            message: "",
            error: ""
        }
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.viewSingleChatDetail(this.props.route.params.chatId);
        })   
    }

    renderItem = ({item}) => {
        console.log(item)
        return <Message userName={item.user_name} message={item.message} user_id={item.user_id} time={item.message_time} />
    }

    clearErrorMessages() {
        this.setState({error: ""})
      }

    async send(chatId, userName){
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
                console.log("OK")

                console.log(response.json)
                const myId = await AsyncStorage.getItem("whatsthat_user_id")
                const newMessage = {
                    message: this.state.message,

                    user_id : myId,
                    user_name: userName,
                    message_time: new Date(Date.now()).toLocaleString()
                    
                }
               
                const updatedConversation = [...this.state.conversation, newMessage];
                this.setState({conversation: updatedConversation, message: ""});
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
        console.log("hi")
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
                const conversationObject = [];
                responseJson.messages.forEach((msg) => {
                    const messageObject = {
                        message: msg.message,
                        user_id: msg.author.user_id,
                        user_name: msg.author.first_name + " " + msg.author.last_name,
                        message_id: msg.message_id,
                        message_time: new Date(msg.timestamp).toLocaleString()
                    }
                    conversationObject.unshift(messageObject);
                })
                this.setState({conversation: conversationObject})
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

    render(){
        const {conversationTitle} = this.props.route.params;
        const {userName} = this.props.route.params;
        const {chatId} = this.props.route.params;
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title={conversationTitle} />

                <View style={GlobalStyle.wrapper}>
                    <FlatList 
                        data={this.state.conversation}
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
                    <TouchableOpacity onPress={() => this.send(chatId, userName)}>
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
    titleHeaderSection: {
        justifyContent: 'flex-start'
    },
    titleText: {
        flex: 0.9
    }
})

