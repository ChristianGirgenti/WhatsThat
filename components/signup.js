import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

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
            this.setState({passwordErr : "Invalid password length. The password must have a minimum of 8 characters and a maximum of 30."})
          else
            this.setState({passwordErr: "Invalid password. The password must have an uppercase letter, a lowercase letter, a special character and a number."})
          return
        }
        this.clearErrorMessages()
      }
    
      render() {
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text>Insert Name: </Text>
                <TextInput placeholder='First name' onChangeText={(name) => this.setState({name})} value={this.state.name} /> 
            </View>

            <View style={styles.textContainer}>
                <Text>Insert Last Name: </Text>
                <TextInput style={styles.container} placeholder='Last name' onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName} />
            </View>

            <View style={styles.textContainer}>
                <Text>Insert Email: </Text>
                <TextInput placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />
            </View>
            <>
                {this.state.emailErr && this.state.submitted &&
                    <Text style={styles.errorText}>{this.state.emailErr}</Text>
                }
            </>  

            <View style={styles.textContainer}>
              <Text>Insert Password: </Text>
              <TextInput placeholder='Password' secureTextEntry='true' onChangeText={(password) => this.setState({password})} value={this.state.password} /> 
            </View>
            <>
                {this.state.passwordErr && this.state.submitted &&
                  <Text style={styles.errorText}>{this.state.passwordErr}</Text>
                }
            </> 

            <TouchableOpacity style={styles.buttonGreen} onPress={() => this.signup()}>
                          <Text>Sign up</Text>
            </TouchableOpacity>
            <>
                {
                  this.state.genericErr &&
                  <Text style={styles.errorText}>{this.state.genericErr}</Text>
                }
            </>
          </View>
        
        );
        
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
        fontSize: 14
      },
      textContainer: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center'
      },
      buttonGreen: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: 80,
        height: 30, 
        marginTop: 20,
        marginLeft: 20,
        justifyContent: 'center'
      },
      errorText: {
        color: 'red'
      }
    });