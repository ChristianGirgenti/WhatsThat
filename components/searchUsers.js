import React, { Component } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { stringifyValueWithProperty } from 'react-native-web/dist/cjs/exports/StyleSheet/compiler';

export default class SearchUsers extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchTerm: "",
            searchResults: [],
            error: ""
          }

          this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
      }

    renderItem = ({item}) => {
        return <Contact name={item.given_name} lastName={item.family_name} imageSource={item.photo}/>
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

    }

    async handleSearchTermChange(searchTerm) 
    {   
        if (searchTerm === "") {
            this.setState({searchTerm: ""})
            this.setState({searchResults : []})
            return
        }
        this.setState({searchTerm: searchTerm});
        return fetch("http://localhost:3333/api/1.0.0/search?q="+searchTerm,
        {
            method: 'get',
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

    });
