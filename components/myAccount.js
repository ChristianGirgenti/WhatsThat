import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class MyAccount extends Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading : true,
            name : "",
            lastName : "",
            email : "",
            error : "",
            submitted : false,
            photo: null
          }
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.get_profile_image();
            this.getUserInformation();
        })
    }

    edit(){
        this.props.navigation.navigate('EditAccount')
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

    async get_profile_image(){
        const userId = await AsyncStorage.getItem("whatsthat_user_id")
        fetch("http://localhost:3333/api/1.0.0/user/"+userId+"/photo", 
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
        
            this.setState({
                isLoading: false,
                photo: data
            })
        })
        .catch((thisError) => {
            this.setState({error: thisError})
        })

    }

    async getUserInformation(){
        const userId = await AsyncStorage.getItem("whatsthat_user_id")
        return fetch("http://localhost:3333/api/1.0.0/user/"+userId,
        {
            method: 'get',
            headers: {'X-Authorization': await AsyncStorage.getItem("whatsthat_session_token")}   
          })
        .then(async (response) => {
            if (response.status === 200) return response.json();
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else throw "Something went wrong while retrieving your data"
          })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                name: responseJson.first_name,
                lastName: responseJson.last_name,
                email: responseJson.email,
                submitted: false
            })
        })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }   

    render(){
        if (this.state.isLoading){
            return(
                <View>
                    <ActivityIndicator />
                </View>
            )
        }
        return(
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeader title="My Account" />
                <View style={styles.formContainer}>

                    <>
                        {
                        this.state.photo &&
                        <Image source={{uri: this.state.photo}} style={styles.imageDimensione} />
                        }
                    </>
                
                    <Text style={[GlobalStyle.baseText, styles.paddingBottom, styles.paddingTop]}>{this.state.name}</Text>
                    <Text style={[GlobalStyle.baseText, styles.paddingBottom]}>{this.state.lastName}</Text>
                    <Text style={[GlobalStyle.baseText, styles.paddingBottom]}>{this.state.email}</Text>               
                 

                    <TouchableOpacity style={GlobalStyle.button} onPress={() => this.edit()}>
                        <Text style={GlobalStyle.buttonText}>Edit</Text>
                    </TouchableOpacity>

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

const styles = StyleSheet.create({
    formContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 15
    },
    imageDimensione:{
        width:100,
        height: 100
    },
    paddingBottom: {
        paddingBottom: 20
    },
    paddingTop: {
        paddingTop:20
    }
  });