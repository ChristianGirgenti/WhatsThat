import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UpdateChatInformation extends Component{

    constructor(props){
        super(props);

        this.state = {
            error : "",
            newTitle: "", 
            submitted: false
          }
    }

    clearErrorMessages() {
        this.setState({error: ""})
    }

    async update(){
        this.clearErrorMessages()
        this.setState({submitted : true})

        if (this.state.newTitle == "")
        {
            this.setState({error: "No title has been inserted"})
            return
        }

        let to_send = {};
        if (this.props.route.params.conversationTitle != this.state.newTitle)
            to_send = {name: this.state.newTitle}
        
        if (Object.keys(to_send).length === 0) 
        {
            this.setState({error: "Nothing to update!"})
            return 
        }
        
        return fetch("http://localhost:3333/api/1.0.0/chat/"+this.props.route.params.chatId,
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
                this.props.navigation.navigate("DisplayConversation")
            }  
            else if (response.status === 400) throw "Bad Request"
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 403) throw "Can not update the chat title!"
            else if (response.status === 404) throw "Chat not found!!"
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
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Update Chat Information" />
 
                <View style={styles.bodyContainer}>
                    <View style={styles.updateTitleSection}>
                        <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='New chat title' onChangeText={(newTitle) => this.setState({newTitle})} value={this.state.newTitle} />
                        <>
                            {
                            this.state.error &&
                            <View style={GlobalStyle.errorBox}>
                                <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                                <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                            </View>
                            }
                        </>
                        <TouchableOpacity style={GlobalStyle.button} onPress={() => this.update()}>
                            <Text style={GlobalStyle.buttonText}>Update Title</Text>
                        </TouchableOpacity>
                    </View>                 
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex:15,
    },
    updateTitleSection: {
        alignItems: 'center'
    }
})


