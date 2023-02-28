import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeader from './screenForNavigation/navigationHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class LogInScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          email : "",
          password : "",
          error : "",
          submitted : false
        }

      }
    
      clearErrorMessages() {
        this.setState({error: ""})
      }
    
      validateFields() {
        if (!(this.state.email && this.state.password))
        {
          this.setState({error: "All fields must be filled"})
          return false;
        }
        return true;
      }

      login() {
        this.clearErrorMessages()
        this.setState({submitted : true})
        if (!this.validateFields()) return
        let to_send = {
          email: this.state.email,
          password: this.state.password
        };
        return fetch("http://localhost:3333/api/1.0.0/login",
        {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(to_send)
        })
        .then(response => {
          if (response.status === 200) return response.json();
          else if (response.status === 400) throw "Invalid email or password supplied"
          else throw "Something went wrong while trying to log in"
        })
        .then(async rJson => {
          try {
            await AsyncStorage.setItem("whatsthat_user_id", rJson.id)
            await AsyncStorage.setItem("whatsthat_session_token", rJson.token)
            this.setState({'submitted' : false});
            this.props.navigation.navigate('Home')
          }
          catch {
            throw "Something went wrong while trying to log in"
          }
        })
        .catch((thisError) => {
          this.setState({error: thisError})
          this.setState({submitted: false})
        })      
      }

      render() {
        return (
         <View style={GlobalStyle.mainContainer}>
            <NavigationHeader title="Login" />

            <View style={styles.loginFormContainer}>
                <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />

                <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} /> 

                <TouchableOpacity style={GlobalStyle.button} onPress={() => this.login()}>
                            <Text style={GlobalStyle.buttonText}>Login</Text>
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
                <View style={[GlobalStyle.baseText, styles.redirectToSignUp]}>
                    <Text>Don't have an account?  </Text>
                    <Text onPress={() => this.props.navigation.navigate('Signup')} style={styles.signUpText}>Sign up!!</Text>
                </View>           
            </View>          
        </View>    
        ); 
      }
    }    
    const styles = StyleSheet.create({
      loginFormContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 15    
      },
      redirectToSignUp: {
        marginTop: 30,
        textAlign: 'center',
        flexDirection: 'row'
      },
      signUpText: {
        fontWeight: 'bold',
        textDecorationLine: 'underline'
      }
    });