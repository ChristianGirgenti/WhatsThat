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

       // {id: 1, user_id: 1, name: "Ash", message: "Tell me why?"},
                // {id: 2, user_id: 2, name: "Ronan", message: "Ain't nothing by a heartache"},
                // {id: 3, user_id: 1, name: "Ash", message: "Tell me why?"},
                // {id: 4, user_id: 2, name: "Ronan", message: "Ain't nothing by a mistake"},
                // {id: 5, user_id: 1, name: "Ash", message: "Tell me why?"},
                // {id: 6, user_id: 2, name: "Ronan", message: "I never want to hear you say"},
                // {id: 7, user_id: 1, name: "Ash", message: "I want it that way"},
                // {id: 8, user_id: 2, name: "Ronan", message: "Am I your fire? Your one desire?"},
                // {id: 9, user_id: 1, name: "Ash", message: "No, don't call here no more creep!"},
                // {id: 10, user_id: 2, name: "Ronan", message: "I never want to hear you say"},
                // {id: 11, user_id: 1, name: "Ash", message: "I want it that way"},
                // {id: 12, user_id: 1, name: "Ash", message: "Am I your fire? Your one desire?"},
                // {id: 13, user_id: 2, name: "Ronan", message: "No, don't call here no more creep!"},

    renderItem = ({item}) => {
        console.log(item)
        return <Message userName={item.user_name} message={item.message} user_id={item.user_id} />
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
                const myId = await AsyncStorage.getItem("whatsthat_user_id")
                const newMessage = {
                    user_id : myId,
                    user_name: userName,
                    message: this.state.message
                }
                console.log(this.state.conversation)
                console.log(newMessage)
               
                const updatedConversation = [...this.state.conversation, newMessage];
                

                this.setState({conversation: updatedConversation, message: ""});
                console.log(this.state.conversation)

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

    render(){
        const {conversationTitle} = this.props.route.params;
        const {chatId} = this.props.route.params;
        const {userName} = this.props.route.params;

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

