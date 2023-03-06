import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';



//SAVE CHANGES MIGHT WORK BUT POSSIBLY PATCH IS NOT CONFIGURED

export default class EditAccount extends Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading : true,
            name : "",
            lastName : "",
            email : "",
            error : "",
            submitted : false,
            nameStored: "",
            lastNameStored: "",
            emailStored: "",
            photo: null
        }
    }


    componentDidMount(){
        this.get_profile_image();
        this.getUserInformation();
        
    }

    clearErrorMessages() {
        this.setState({error: ""})
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
            console.log(responseJson)
            this.setState({
                isLoading: false,
                name: responseJson.first_name,
                nameStored: responseJson.first_name,
                lastName: responseJson.last_name,
                lastNameStored: responseJson.last_name,
                email: responseJson.email,
                emailStored: responseJson.email,
                submitted: false 
            }) 
        })
        .catch((thisError) => {
            this.setState({error: thisError})
        })
    }   

    async saveChanges() {
        this.clearErrorMessages()
        this.setState({submitted : true})
        let to_send = {};
        if (this.state.name != this.state.nameStored)
            to_send = {...to_send, first_name: this.state.name}
        if (this.state.lastName != this.state.lastNameStored)
            to_send = {...to_send, last_name: this.state.lastName}
        if (this.state.email != this.state.emailStored)
            to_send = {...to_send, email: this.state.email}
        if (Object.keys(to_send).length === 0) 
        {
            this.setState({error: "Nothing to update!"})
            return 
        }
        const userId = await AsyncStorage.getItem("whatsthat_user_id")       
        return fetch("http://localhost:3333/api/1.0.0/user/"+userId,
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
                this.props.navigation.navigate("MyAccount")
            }  
            else if (response.status === 400) throw "Bad Request"
            else if (response.status === 401) {
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
            }
            else if (response.status === 403 || response.status === 404) throw "Can not update the information!"
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
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Edit Account" />

                <View style={styles.formContainer}>
                    

                    <>
                        {
                        this.state.photo &&
                        <Image source={{uri: this.state.photo}} style={{width: 100, height: 100}} />
                        }
                    </>

                    <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} value={this.state.name} onChangeText={(name) => this.setState({name})}  /> 
                    <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} value={this.state.lastName} onChangeText={(lastName) => this.setState({lastName})}  />
                    <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} value={this.state.email} onChangeText={(email) => this.setState({email})}   />               
                                 
                    <TouchableOpacity style={GlobalStyle.button} onPress={() => this.saveChanges()}>
                        <Text style={GlobalStyle.buttonText}>Save</Text>
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
  });