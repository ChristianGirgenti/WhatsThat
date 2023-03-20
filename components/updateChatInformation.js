import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';

export default class UpdateChatInformation extends Component{

    constructor(props){
        super(props);

        this.state = {
            error : "",
            newTitle: "", 
            submitted: false,
            chatMembers: [],
            errorInputForm: ""
          }
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus',async () => {
            await this.getChatMembers(this.props.route.params.chatId);
        })   
    }

    async getContactPhoto(userId)
    {
        this.clearErrorMessages()

        return fetch("http://localhost:3333/api/1.0.0/user/"+userId+"/photo", 
        {
            method: "GET",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async (response) => {
            
            if (response.status === 200) return response.blob();
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else throw "Something went wrong while retrieving your data"
          })
        .then((resBlob) => {
            let data = URL.createObjectURL(resBlob);
            return data;
        })
        .catch((thisError) => {
            this.setState({error: thisError})
        })

    };


    async getChatMembers(chatId)
    {
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
                const updatedResponseJson = await Promise.all(responseJson.members.map(async (item) => {
                    const photo = await this.getContactPhoto(item.user_id);
                    return {...item, photo}
                }));
                this.setState({chatMembers: updatedResponseJson})
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 404) {
                //This is returning when user delete itself from a chat and they were the last one in the chat.
                //When trying to get the remaining members, the chatId is not found as the chat is eliminated if there are
                //not sure, hence, it redirects to all chat
                console.log("Chat not found");
                this.props.navigation.navigate("DisplayConversation")
            }
          })
        .catch((thisError) => {
            this.setState({error: thisError.toString()})
        })
    }




    clearErrorMessages() {
        this.setState({error: ""})
        this.setState({errorInputForm: ""})
    }

    async updateTitle(chatId){
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
        
        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId,
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
            this.setState({errorInputForm: thisError.toString()})
            this.setState({submitted: false})
        })      

    }

    async addToTheChat(userId)
    {
    
    }

    async removeFromTheChat(chatId, userId)
    {
        this.clearErrorMessages()

        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId+"/user/"+userId, 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
        })
        .then(async (response) => { 
            if (response.status === 200) {
                this.getChatMembers(chatId)
            }
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 403) throw "Cannot remove this member from the chat"
            else if (response.status === 404) throw "Member not found!"
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }


    renderItem = ({item}) => {
        return <View  style={styles.contactViewContainer} >
                    <Contact name={item.first_name} lastName={item.last_name} imageSource={item.photo} style={styles.contact}/>
               
                    <TouchableOpacity style={styles.removeMember} onPress={() => this.removeFromTheChat(this.props.route.params.chatId, item.user_id)}>
                            <Icon name="minus" color={'red'} size={40} />
                    </TouchableOpacity> 
               </View>
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
                            this.state.errorInputForm &&
                            <View style={GlobalStyle.errorBox}>
                                <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                                <Text style={GlobalStyle.errorText}>{this.state.errorInputForm}</Text>
                            </View>
                            }
                        </>
                        <TouchableOpacity style={GlobalStyle.button} onPress={() => this.updateTitle(this.props.route.params.chatId)}>
                            <Text style={GlobalStyle.buttonText}>Update Title</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[GlobalStyle.wrapper, styles.contactListContainer]}>
                        <>
                        {
                        this.state.error &&
                        <View style={GlobalStyle.errorBox}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                        </> 
                        <Text style={[GlobalStyle.titleText, styles.chatMembersText]}>Current Chat members</Text>     
                        <FlatList 
                            data={this.state.chatMembers}
                            renderItem= {this.renderItem}
                            keyExtractor={(item,index) => index.toString()}
                        />                                                                          
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
    },
    contactListContainer: {
        marginTop:10
    },
    contactViewContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 'thin',
        justifyContent: 'space-between'
    },
    removeMember: {
        justifyContent: 'center'
    },
    chatMembersText: {
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    }
})


