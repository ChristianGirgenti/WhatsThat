import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';

export default class LogInScreen extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      userEmail: '',
      userPassword: '',
      error: '',
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.clearFields();
      this.clearErrorMessages();
    });
    this.unsubscribe = this.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value != null) this.navigation.navigate('Home');
  };

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  clearFields() {
    this.setState({ userEmail: '' });
    this.setState({ userPassword: '' });
  }

  validateFields() {
    const { userEmail } = this.state;
    const { userPassword } = this.state;
    if (!(userEmail && userPassword)) {
      this.setState({ error: 'All fields must be filled' });
      return false;
    }
    return true;
  }

  login() {
    this.clearErrorMessages();
    if (!this.validateFields()) return;
    const { userEmail } = this.state;
    const { userPassword } = this.state;
    const toSend = {
      email: userEmail,
      password: userPassword,
    };
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      },
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 400) throw 'Invalid email or password supplied';
        else throw 'Something went wrong while trying to log in';
      })
      .then(async (rJson) => {
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);
          this.navigation.navigate('Home');
        } catch {
          throw 'Something went wrong while trying to log in';
        }
      })
      .catch((thisError) => {
        this.setState({ error: thisError });
      });
  }

  render() {
    const { userEmail } = this.state;
    const { userPassword } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeader title="Login" />

        <View style={styles.loginFormContainer}>
          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="Email" onChangeText={(email) => this.setState({ userEmail: email })} value={userEmail} />

          <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="Password" secureTextEntry onChangeText={(password) => this.setState({ userPassword: password })} value={userPassword} />

          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.login()}>
            <Text style={GlobalStyle.buttonText}>Login</Text>
          </TouchableOpacity>
          <>
            {
                  error
                  && (
                  <View style={GlobalStyle.errorBox}>
                    <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                    <Text style={GlobalStyle.errorText}>{error}</Text>
                  </View>
                  )
                  }
          </>
          <View style={[GlobalStyle.baseText, styles.redirectToSignUp]}>
            <Text>Don&apos;t have an account?  </Text>
            <Text onPress={() => this.navigation.navigate('Signup')} style={styles.signUpText}>Sign up!!</Text>
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
    flex: 15,
  },
  redirectToSignUp: {
    marginTop: 30,
    textAlign: 'center',
    flexDirection: 'row',
  },
  signUpText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
