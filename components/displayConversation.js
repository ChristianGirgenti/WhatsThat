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
            conversations: [
                {name: "Ash", lastName: "Williams", conversation:"hello, how are you?"},
                {name: "Ronan", lastName: "Smith", conversation:"what's up dude?"},
                {name: "Christian", lastName: "Girgenti", conversation:"see you tomorrow then"},
                {name: "Natalie", lastName: "Williams", conversation:"This is just a text to check the lenght get cut off when about to go to two lines"}
            ],
            error: "",
        }
    }

    async create(){
        this.clearErrorMessages();
        let to_send = {
            name: this.state.conversationTitle,
          };
        if (this.state.conversationTitle === "")
        {
            this.setState({error: "The conversation title can not be empty"})
            return
        }    
        return fetch("http://localhost:3333/api/1.0.0/chat/", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
            body: JSON.stringify(to_send)
        })
        .then(async (response) => { 
            console.log(response.status)
            if (response.status === 201) {
                console.log("OK")

                this.props.navigation.navigate('Conversation', {
                    conversationTitle: this.state.conversationTitle
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
        return <PreviewConversation name={item.name} lastName={item.lastName} conversation={item.conversation} navigation={this.props.navigation}/>
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
        alignItems:'flex-end'
    },
    conversationTitleContainer: {
        paddingLeft:10,
        paddingTop:5,
        paddingBottom:5,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        height: 40,
        width: '100%'
    },
    error: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    }
});