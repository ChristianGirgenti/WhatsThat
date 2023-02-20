import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class LogInScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          email : "",
          password : "",
          fieldNotFilledErr : "",
          wrongCredentialErr : "",
          submitted : false
        }

      }
    
      clearErrorMessages() {
        this.setState({fieldNotFilledErr: ""})
      }
    
      login() {
        this.clearErrorMessages()
        this.setState({submitted : true})
        if (!(this.state.email && this.state.password))
        {
          this.setState({fieldNotFilledErr: "All fields must be filled"})
          return
        }
        
        //DONT NEED TO VALIDATE EMAIL AND PASSWORD AS WE CAN JUST CHECK IF THE LOGIN IS SUCCESSFULL OR NOT
        // IF NOT SUCCESSFULL, GIVE A VALUE TO WRONGCREDENTIALERROR
        this.clearErrorMessages()
      }

      

      render() {
        const navigation = this.props.navigation;

        return (
         <View style={styles.loginFormContainer}>
            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />

            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} /> 
          
            <TouchableOpacity style={GlobalStyle.button} onPress={() => this.login()}>
                        <Text style={GlobalStyle.buttonText}>Login</Text>
            </TouchableOpacity>
            <>
                {
                this.state.fieldNotFilledErr &&
                <View style={GlobalStyle.errorBox}>
                    <Icon name="times" size={16} color="red" style={GlobalStyle.errorIcon} />
                    <Text style={GlobalStyle.errorText}>{this.state.fieldNotFilledErr}</Text>
                </View>
                }
            </>
            <View style={[GlobalStyle.baseText, styles.redirectToSignUp]}>
                <Text>Don't have an account?  </Text>
                <Text onPress={() => navigation.navigate('Signup')} style={styles.signUpText}>Sign up!!</Text>
            </View> 
        </View>    
      
        );
        
      }
    }    
    const styles = StyleSheet.create({
      loginFormContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'green'
      },
      redirectToSignUp: {
        marginTop: 30,
        textAlign: 'center',
        flexDirection: 'row'
      },
      signUpText: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      }
    });