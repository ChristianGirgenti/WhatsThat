import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditMessage extends Component{

    constructor(props){
        super(props);

        this.state = {
            error : "",
            newMessage: this.props.route.params.message,
            submitted: false
          }
    }



    clearErrorMessages() {
        this.setState({error: ""})
    }

    async save(chatId, messageId){
        this.clearErrorMessages()
        this.setState({submitted : true})

        if (this.state.newMessage == "")
        {
            this.setState({error: "No message has been written"})
            return
        }

        let to_send = {};
        if (this.props.route.params.message != this.state.newMessage)
            to_send = {message: this.state.newMessage}
        
        if (Object.keys(to_send).length === 0) 
        {
            this.setState({error: "Nothing to update!"})
            return 
        }
        
        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId+"/message/"+messageId,
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
                      'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")    
            },
            body: JSON.stringify(to_send)
        })
        .then(async response => {
            if (response.status === 200) {
                console.log("Updated");
                this.setState({submitted : false});
                this.props.navigation.goBack();
            }  
            else if (response.status === 400) throw "Bad Request"
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 403) throw "Can not update the message!"
            else if (response.status === 404) throw "Message not found!!"
            else throw "Something went wrong while trying to log in"
        })
        .catch((thisError) => {
            this.setState({error: thisError.toString()})
            this.setState({submitted: false})
        })      

    }


    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Edit Message" />
 
                <View style={styles.sendMessageContainer}>
                    <TextInput
                        multiline={true} 
                        style={styles.messageBox} 
                        onChangeText={(newMessage) => this.setState({newMessage})} 
                        value={this.state.newMessage}
                        maxLength={70}
                        />
                    <TouchableOpacity onPress={() => this.save(this.props.route.params.chatId, this.props.route.params.messageId)}>
                        <Icon name="send" color={'black'} size={40} />
                    </TouchableOpacity>
                </View>       
                    <>
                        {
                        this.state.error &&
                        <View style={GlobalStyle.errorBox}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    sendMessageContainer: {
        flex:15,
        flexDirection: 'row',
        backgroundColor: 'white',
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

})


