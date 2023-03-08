import React, { Component } from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Contact from './contact';
import NavigationHeader from './screenForNavigation/navigationHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class DisplayContacts extends Component{

    constructor(props){
        super(props);

        this.state = {
            contacts: [],
            error: ""
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getContacts();
        })   
    }

    async getContacts() {
        return fetch("http://localhost:3333/api/1.0.0/contacts",
        {
            method: 'GET',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async (response) => {
            console.log(response)
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
        return <View  style={styles.contactViewContainer} >
                <Contact imageSource={item.photo} name={item.first_name} lastName={item.last_name}/>
               </View>
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeader title="My Contacts" />

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
        )
    }
}

const styles = StyleSheet.create({
    contactViewContainer: {
        borderBottomWidth: 'thin'
    },
  });