import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import * as EmailValidator from 'email-validator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';



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
        this.setState({genericErr: ""}),
        this.setState({passwordErr: ""})
      }
      
      validateInputForms(){
        const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$')
        if (!(this.state.email && this.state.password && this.state.name && this.state.lastName ))
        {
          this.setState({genericErr: "All fields must be filled"})
          return false
        }
    
        if (!(EmailValidator.validate(this.state.email)))
        {
          this.setState({emailErr: "Email not valid"})
          return false
        }
    
        if (!PASSWORD_REGEX.test(this.state.password))
        {
          if (this.state.password.length <8 || this.state.password.length > 30)
            this.setState({passwordErr : "Invalid password length.\nThe password must have a minimum of 8 characters and a maximum of 30."})
          else
            this.setState({passwordErr: "Invalid password.\nThe password must have an uppercase letter, a lowercase letter, a special character and a number."})
          return false
        }
        return true
      }
    
      signup() {
        this.clearErrorMessages()
        this.setState({submitted : true})
        if (!this.validateInputForms()) return
      
        let to_send = {
            first_name: this.state.name,
            last_name: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };
        return fetch("http://localhost:3333/api/1.0.0/user",
        {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(to_send)
        })
        .then((response) => {
          if (response.status == 201) {
            this.setState({submitted: false})
            return this.props.navigation.navigate("Login")
          }
          else if (response.status === 400) 
            throw "Email already exists";
          else 
            throw "Something went wrong while creating the account. Please try again";
            
        })
        .catch((error) => {
          this.setState({genericErr: error})
          this.setState({submitted: false})
        })
      }
    
      render() {

        return (
         <View style={GlobalStyle.mainContainer}>
            <NavigationHeaderWithIcon navigation={this.props.navigation} title="Sign Up"/>
            <View style={ styles.signupFormContainer}>
              <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='First name' onChangeText={(name) => this.setState({name})} value={this.state.name} /> 
              <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Last name' onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName} />
              <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />
              <>
                {
                  this.state.emailErr && this.state.submitted &&
                    <View style={GlobalStyle.errorBox}>
                      <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                      <Text style={GlobalStyle.errorText}>{this.state.emailErr}</Text>
                    </View>
                }
              </>  

            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder='Password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} /> 
            <>
                {
                  this.state.passwordErr && this.state.submitted &&
                  <View style={GlobalStyle.errorBox}>
                    <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
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
                    <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                    <Text style={GlobalStyle.errorText}>{this.state.genericErr}</Text>
                  </View>
                }
            </>
            </View>           
         </View>    
      
        );
        
      }
    }
  

    const styles = StyleSheet.create({
      signupFormContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 15
      },
    });