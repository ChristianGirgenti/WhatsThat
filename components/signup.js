import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      emailErr: '',
      genericErr: '',
      passwordErr: '',
      submitted: false,
    };
  }

  validateInputForms() {
    const { email } = this.state;
    const { password } = this.state;
    const { name } = this.state;
    const { lastName } = this.state;
    const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
    if (!(email && password && name && lastName)) {
      this.setState({ genericErr: 'All fields must be filled' });
      return false;
    }

    if (!(EmailValidator.validate(email))) {
      this.setState({ emailErr: 'Email not valid' });
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      if (password.length < 8 || password.length > 30) {
        this.setState({ passwordErr: 'Invalid password length.\nThe password must have a minimum of 8 characters and a maximum of 30.' });
      } else {
        this.setState({ passwordErr: 'Invalid password.\nThe password must have an uppercase letter, a lowercase letter, a special character and a number.' });
      }
      return false;
    }
    return true;
  }

  signup() {
    const { email } = this.state;
    const { password } = this.state;
    const { name } = this.state;
    const { lastName } = this.state;
    this.clearErrorMessages();
    this.setState({ submitted: true });
    if (!this.validateInputForms()) return;

    const toSend = {
      first_name: name,
      last_name: lastName,
      email,
      password,
    };
    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          this.setState({ submitted: false });
          this.navigation.navigate('Login');
        } else if (response.status === 400) { throw 'Email already exists'; } else { throw 'Something went wrong while creating the account. Please try again'; }
      })
      .catch((error) => {
        this.setState({ genericErr: error });
        this.setState({ submitted: false });
      });
  }

  clearErrorMessages() {
    this.setState({ emailErr: '' });
    this.setState({ genericErr: '' });
    this.setState({ passwordErr: '' });
  }

  render() {
    const { emailErr } = this.state;
    const { submitted } = this.state;
    const { email } = this.state;
    const { password } = this.state;
    const { name } = this.state;
    const { lastName } = this.state;
    const { passwordErr } = this.state;
    const { genericErr } = this.state;

    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Sign Up" />
        <View style={styles.signupFormContainer}>
          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="First name" onChangeText={(newName) => this.setState({ name: newName })} value={name} />
          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="Last name" onChangeText={(newLastName) => this.setState({ lastName: newLastName })} value={lastName} />
          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="Email" onChangeText={(newEmail) => this.setState({ email: newEmail })} value={email} />
          <>
            {
              emailErr && submitted
                && (
                <View style={GlobalStyle.errorBox}>
                  <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                  <Text style={GlobalStyle.errorText}>{emailErr}</Text>
                </View>
                )
            }
          </>

          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="Password" secureTextEntry onChangeText={(newPassword) => this.setState({ password: newPassword })} value={password} />
          <>
            {
              passwordErr && submitted
              && (
              <View style={GlobalStyle.errorBox}>
                <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                <Text style={GlobalStyle.errorText}>{passwordErr}</Text>
              </View>
              )
            }
          </>
          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.signup()}>
            <Text style={GlobalStyle.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <>
            {
              genericErr
              && (
              <View style={GlobalStyle.errorBox}>
                <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                <Text style={GlobalStyle.errorText}>{genericErr}</Text>
              </View>
              )
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
    flex: 15,
  },
});
