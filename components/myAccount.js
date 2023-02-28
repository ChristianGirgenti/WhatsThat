import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class MyAccount extends Component{

    constructor(props){
        super(props);

        this.state = {
            error : "",
            submitted : false
          }
    }

    async logout(){
        this.setState({submitted: true})
        return fetch("http://localhost:3333/api/1.0.0/logout",
        {
          method: 'post',
          headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
        })
        .then(async response => {
          if (response.status === 200) {
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
            this.setState({submitted: false})
            this.props.navigation.navigate("Login")
          } 
          else if (response.status === 401) 
          {
            console.log("Unauthorised")
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
            this.props.navigation.navigate("Login")
          }
          else throw "Something went wrong"
        })
        .catch((thisError) => {
          this.setState({error: thisError})
          this.setState({submitted: false})
        })      
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeader title="My Account" />
                <View style={GlobalStyle.wrapper}>
                    <TouchableOpacity style={GlobalStyle.button} onPress={() => this.logout()}>
                        <Text style={GlobalStyle.buttonText}>Logout</Text>
                    </TouchableOpacity>
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
            </View>
        )
    }
}