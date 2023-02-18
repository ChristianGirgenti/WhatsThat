import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as EmailValidator from 'email-validator';


export default class SignUpScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          name : "",
          lastName : "",
          email : "",
          password : "",
          emailErr : "",
          genericErr : "",
          passwordErr : "",
          submitted : false
        }
      }
    
      clearErrorMessages() {
        this.setState({emailErr : ""}),
        this.setState({genericErr: ""})
      }
    
      signup() {
        this.clearErrorMessages()
        this.setState({submitted : true})
        const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$')
        if (!(this.state.email && this.state.password && this.state.name && this.state.lastName ))
        {
          this.setState({genericErr: "All fields must be filled"})
          return
        }
    
        if (!(EmailValidator.validate(this.state.email)))
        {
          this.setState({emailErr: "Email not valid"})
          return
        }
    
        if (!PASSWORD_REGEX.test(this.state.password))
        {
          if (this.state.password.length <8 || this.state.password.length > 30)
            this.setState({passwordErr : "Invalid password length.\nThe password must have a minimum of 8 characters and a maximum of 30."})
          else
            this.setState({passwordErr: "Invalid password.\nThe password must have an uppercase letter, a lowercase letter, a special character and a number."})
          return
        }
        this.clearErrorMessages()
      }
    
      render() {
        console.log(Icon);
        return (
         <View style={styles.signupFormContainer}>
            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='First name' onChangeText={(name) => this.setState({name})} value={this.state.name} /> 
            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Last name' onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName} />
            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />
            <>
              {
                this.state.emailErr && this.state.submitted &&
                  <View style={GlobalStyle.errorBox}>
                     <Icon name="times" size={20} color="red" style={GlobalStyle.errorIcon} />
                     <Text style={GlobalStyle.errorText}>{this.state.emailErr}</Text>
                  </View>
              }
            </>  

          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} /> 
          <>
              {
                this.state.passwordErr && this.state.submitted &&
                <View style={GlobalStyle.errorBox}>
                  <Icon name="times" size={16} color="red" style={GlobalStyle.errorIcon} />
                  <Text style={GlobalStyle.errorText}>{this.state.passwordErr}</Text>
                </View>
              }
          </> 
          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.signup()}>
                        <Text style={GlobalStyle.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <>
              {
                this.state.genericErr &&
                <View style={GlobalStyle.errorBox}>
                  <Icon name="times" size={16} color="red" style={GlobalStyle.errorIcon} />
                  <Text style={GlobalStyle.errorText}>{this.state.genericErr}</Text>
                </View>
              }
          </>
         </View>    
      
        );
        
      }
    }
    
    const styles = StyleSheet.create({
      signupFormContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      },
    });