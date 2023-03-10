import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SearchUsers extends Component {

    //WHEN I ADD A USER TO MY CONTACTS, DO I STILL WANT TO DISPLAY IT AS RESULT OF MY USER SEARCH??
    //I AM NOT SHOWING MY OWN ACCOUNT IN THE SEARCH, IS THAT OK ?
    //ONCE I TAKE A PICTURE, IT DOESN'T UPDATE IT STRAIGHT AWAY BUT ON CHANGE OF WINDOW. 

    constructor(props){
        super(props);

        this.state = {
            searchTerm: "",
            searchResults: [],
            error: "",
            currentUserId: 0
          }

          this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
      }

    renderItem = ({item}) => {
        if (item.user_id != this.state.currentUserId)
        {
            return <View style={styles.contactViewContainer}>
                    <Contact name={item.given_name} lastName={item.family_name} imageSource={item.photo} style={styles.contact}/>
                    
                    <View style={styles.groupButton}>
                        <TouchableOpacity style={styles.addButton} onPress={() => this.addContact(item.user_id)}>
                            <Icon name="account-plus" color={'green'} size={40} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.send()}>
                            <Icon name="account-cancel-outline" color={'red'} size={40} />
                        </TouchableOpacity>                    
                    </View>
                  
                   </View>                
        }
    }

    async getContactPhoto(userId)
    {
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

    async handleSearchTermChange(searchTerm) 
    {   
        this.state.currentUserId =  await AsyncStorage.getItem("whatsthat_user_id");
        if (searchTerm === "") {
            this.setState({searchTerm: ""})
            this.setState({searchResults : []})
            return
        }
        this.setState({searchTerm: searchTerm});
        return fetch("http://localhost:3333/api/1.0.0/search?q="+searchTerm,
        {
            method: 'GET',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
          })
        .then(async (response) => {
            if (response.status === 200)
            {
                const responseJson = await response.json();

                //RESPONSEJSON HERE WAS ONLY HOLDING INFORMATION ABOUT ID, NAME, LASTNAME, AND EMAIL OF THE CONTACT
                //I NEEDED TO ADD THE PHOTO IN RESPONSE SOMEHOW
                //WITH THE CALL BELOW, I AM MAKING MANY ASYNCRONOUS CALL OF GETCONTACT PHOTO USING PROMISE AND THEN MAPPING IT TO ITEM.
                //IN THIS WAY, I AM ADDING THE PHOTO URL AS NEW FIELD OF RESPONSEJSON AND IT IS ASSIGNED TO UPDATED RESPONSEJSON
                //I AM THEN SETTING MY SEARCH RESULTS STATUS
                
                const updatedResponseJson = await Promise.all(responseJson.map(async (item) => {
                    const photo = await this.getContactPhoto(item.user_id);
                    return {...item, photo}
                }));
                this.setState({searchResults: updatedResponseJson})
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
    };

    async addContact(userIdToAdd){
        console.log(userIdToAdd)
        fetch("http://localhost:3333/api/1.0.0/user/"+userIdToAdd+"/contact", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            },   
        })
        .then(async (response) => { 
            if (response.status === 200) {
                this.props.navigation.navigate("Contacts")
            } 
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 404) throw "User not found!"
            else if (response.status === 400) throw "You can't add yourself as a contact"
            else throw "Something went wrong while retrieving your data"
          })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    };

    
    render() {
        return (
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeader title="Search Users" />
                <View style={GlobalStyle.wrapper}>
                    <TextInput
                        style={styles.searchBarContainer}
                        onChangeText={this.handleSearchTermChange}
                        value={this.state.searchTerm}
                        placeholder="Search..."
                    />
                    <>
                        {
                        this.state.error &&
                        <View style={GlobalStyle.errorBox}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>                    
                    
                    <View style={[GlobalStyle.wrapper, styles.paddingFlatList]}>

                    <FlatList 
                        data={this.state.searchResults}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                    </View>
                    <TouchableOpacity style={[GlobalStyle.button, styles.goToBlockedListButton]} onPress={() => this.props.navigation.navigate("BlockedUsers")}>
                            <Text style={GlobalStyle.buttonText}>Blocked Users</Text>
                    </TouchableOpacity>

                </View>

            </View>   
        );
        
      }
    }

     
    const styles = StyleSheet.create({
        searchBarContainer: {
            flex: 1,
            paddingLeft:10,
            paddingTop:5,
            paddingBottom:5,
            flexDirection: 'row',
            backgroundColor: 'white',
            borderBottomWidth: 1,
            height: 40
        },
        paddingFlatList: {
            paddingTop: 20
        },
        addButton: {
            marginRight: 10
        },
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
        goToBlockedListButton: {
            width: '100%',
        },
        groupButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10
        }

    });
