import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class Schedule extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.route = props.route;
    this.state = {
      time: '',
      date: '',
      error: '',
    };
  }

  validateDateAndTime() {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    const regexTime = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!regexDate.test(this.state.date)) {
      return false;
    }
    if (!regexTime.test(this.state.time)) {
      return false;
    }
    return true;
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  async send(chatId, draft) {
    const now = new Date();
    // Create a new Date object with no arguments to represent the current time
    const hours = now.getHours(); // Get the current hour (0-23)
    const minutes = now.getMinutes(); // Get the current minute (0-59)
    const seconds = now.getSeconds(); // Get the current second (0-59)
    console.log(`The current time is ${hours}:${minutes}:${seconds}`); // Output: "The current time is 14:30:45" (for example)
    this.clearErrorMessages();
    const toSend = {
      message: draft,
    };
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify(toSend),
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Draft Sent');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 400) throw new Error('You can not create the new chat');
        else throw new Error('Something went wrong while creating the new chat');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async schedule() {
    const now = new Date();
    // Create a new Date object with no arguments to represent the current time
    const hours = now.getHours(); // Get the current hour (0-23)
    const minutes = now.getMinutes(); // Get the current minute (0-59)
    const seconds = now.getSeconds(); // Get the current second (0-59)
    console.log(`The current time is ${hours}:${minutes}:${seconds}`); // Output: "The current time is 14:30:45" (for example)

    this.clearErrorMessages();
    if (!this.validateDateAndTime()) {
      this.setState({ error: 'Date or Time format are not valid' });
      return;
    }
    const sendTime = new Date(`${this.state.time} ${this.state.date}`);
    const currentTime = new Date().getTime();
    const delay = sendTime - currentTime;
  }

  render() {
    const { message } = this.route.params;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Schedule" />
        <View style={GlobalStyle.wrapper}>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Draft Message: </Text>
            <Text style={GlobalStyle.baseText}>{message}</Text>
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Date: </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(date) => this.setState({ date })}
            />
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Time: </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(time) => this.setState({ time })}
            />
          </View>
          <View style={styles.form}>
            <TouchableOpacity style={GlobalStyle.button} onPress={() => this.schedule()}>
              <Text style={GlobalStyle.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: 'white',
  },
  fontBold: {
    fontWeight: 'bold',
  },
});
