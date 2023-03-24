// WHEN I ADD A CONTACT, IT AUTOMATICALLY GOES TO BOTH THE MEMBERS CONTACT LIST

import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class AddNewMembersToChat extends Component {
    constructor(props){
        super(props);

        this.state = {
            contacts: [],
            error: ""
          }

      }

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.getContacts();
        })   
    }

    clearErrorMessages() {
        this.setState({error: ""})
    }

    async addNewMember(chatId, userId){
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/chat/"+chatId+"/user/"+userId, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
        })
        .then(async (response) => { 
            if (response.status === 200) {
                console.log("Added")
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 404) throw "Contact not found!"
            else if (response.status === 403) throw "You can not add this account to the chat"
            //The bad request below returns if trying to add to the chat a user already part of the chat or trying to add a user not belonging in the contact list.
            //I tried to remove the last scenario by only giving a chance to the user to add members of the contact list through the front-end.
            //However, there is a bug in the API where if User A add User B as contact, User A will automatically be added to User B contact list.
            //When logged in with User B, User A will appear in User B contact list, however, if User B tries to add User A to the chat, 
            //will look like User A is not part of the User B contact list so will return the 400.
            else if (response.status === 400) throw "This user is already part of the chat or is not in your contact"
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }

    async getContacts() {
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/contacts",
        {
            method: 'GET',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async (response) => {
            if (response.status === 200)
            {
                const responseJson = await response.json();
                const updatedResponseJson = await Promise.all(responseJson.map(async (item) => {
                    const photo = await this.getContactPhoto(item.user_id);
                    return {...item, photo}
                }));
                this.setState({contacts: updatedResponseJson})
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

    renderItem = ({item}) => {
        console.log(item)
        return  <View style={styles.contactViewContainer}>
                    <Contact name={item.first_name} lastName={item.last_name} imageSource={item.photo} style={styles.contact}/>
                    <TouchableOpacity style={styles.addButtonContainer} onPress={() => this.addNewMember(this.props.route.params.chatId, item.user_id)}>
                                <Icon name="plus" color={'green'} size={40} />
                    </TouchableOpacity>
                </View>       
    }
 
    render() {
        return (
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Add New Members To Chat" />
                <View style={GlobalStyle.wrapper}>
                    <>
                        {
                        this.state.error &&
                        <View style={GlobalStyle.errorBox}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>                    
                    <FlatList 
                        data={this.state.contacts}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                </View>

            </View>

        );
        
      }
    }

    const styles = StyleSheet.create({
        contactViewContainer: {
            flexDirection: 'row',
            backgroundColor: 'white',
            borderBottomWidth: 'thin',
            justifyContent: 'space-between'
        },
        contact: {
            width: '70%',
            borderBottomWidth: 0
        },
        addButtonContainer: {
            justifyContent: 'center'
        }
      });
