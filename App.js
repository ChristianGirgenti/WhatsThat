import React, { Component } from 'react';
import {View} from 'react-native';
import SignUpScreen from './components/signup';
import GlobalStyle from './styles/GlobalStyle';

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
      <View style={GlobalStyle.container}>
        <SignUpScreen />
      </View>
    );
    
  }
}

export default App




