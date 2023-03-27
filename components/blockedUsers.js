import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class BlockedUsers extends Component {
    constructor(props){
        super(props);

        this.state = {
            blockedUsers: [],
            error: "",
          }

      }


    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getBlockedContacts();
        })  
    }

    clearErrorMessages() {
        this.setState({error: ""})
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

    async getBlockedContacts() {
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/blocked",
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
                this.setState({blockedUsers: updatedResponseJson})
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


    async unblockContact(userIdToUnblock){
        this.clearErrorMessages()
        return fetch("http://localhost:3333/api/1.0.0/user/"+userIdToUnblock+"/block", 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
        })
        .then(async (response) => { 
            if (response.status === 200) {
                this.props.navigation.navigate('DisplayContacts')
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 404) throw "User not found!"
            else if (response.status === 400) throw "You can't block yourself"
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    };

    renderItem = ({item}) => {
        console.log(item)
        return  <View style={styles.contactViewContainer}>
                    <Contact name={item.first_name} lastName={item.last_name} imageSource={item.photo} style={styles.contact}/>
                    <TouchableOpacity style={styles.unblockButton} onPress={() => this.unblockContact(item.user_id)}>
                                <Icon name="account-lock-open-outline" color={'green'} size={40} />
                    </TouchableOpacity>
                </View>
                
        
    }
 
    render() {
        return (
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Blocked Users" />
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
                        data={this.state.blockedUsers}
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
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        contact: {
            width: '70%',
            borderBottomWidth: 0
        },
        unblockButton: {
            marginRight: 10,
            alignSelf: 'center'
        }
      });
