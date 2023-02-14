import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import SignUpScreen from './components/signup';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
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

  login() {
    this.clearErrorMessages()
    this.setState({submitted : true})
    var validator = require('email-validator')
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$')
    if (!(this.state.email && this.state.password ))
    {
      this.setState({genericErr: "Both email and password need to be inserted"})
      return
    }

    if (!(validator.validate(this.state.email)))
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
    console.log("Email : " + this.state.email)
    console.log("Password : "+ this.state.password)
    this.clearErrorMessages()
  }

  render() {
    return (
      <View>
        {/* <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text>Insert Email: </Text>
          <TextInput style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />
          <>
            {this.state.emailErr && this.state.submitted &&
              <Text style={{color: 'red'}}>{this.state.emailErr}</Text>
            }
          </>  
        </View>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text>Insert Password: </Text>
          <TextInput style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} placeholder='Password' secureTextEntry='true' onChangeText={(password) => this.setState({password})} value={this.state.password} />
          <>
            {this.state.passwordErr && this.state.submitted &&
              <Text style={{color: 'red'}}>{this.state.passwordErr}</Text>
            }
          </>  
        </View>
        <TouchableOpacity style={styles.buttonGreen} onPress={() => this.login()}>
                      <Text>Log in</Text>
        </TouchableOpacity>

        <>
            {
              this.state.genericErr &&
              <Text style={{color: 'red'}}>{this.state.genericErr}</Text>
            }
        </> */}
        <SignUpScreen />
      </View>
    
    );
    
  }
}

const styles = StyleSheet.create({
  buttonGreen: {
    backgroundColor: 'green',
    alignItems: 'center',
    width: 80,
    height: 30, 
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center'
  },
});



export default App




