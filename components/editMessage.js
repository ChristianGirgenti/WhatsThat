import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class EditMessage extends Component {
  constructor(props) {
    super(props);

    this.route = props.route;

    this.state = {
      error: '',
      newMessage: this.route.params.message,
    };
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  async save(chatId, messageId) {
    const { newMessage } = this.state;
    this.clearErrorMessages();

    if (newMessage === '') {
      this.setState({ error: 'No message has been written' });
      return;
    }

    let toSend = {};
    if (this.route.params.message !== newMessage) { toSend = { message: newMessage }; }

    if (Object.keys(toSend).length === 0) {
      this.setState({ error: 'Nothing to update!' });
      return;
    }

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify(toSend),
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Updated');
          this.navigation.goBack();
        } else if (response.status === 400) throw 'Bad Request';
        else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403) throw 'Can not update the message!';
        else if (response.status === 404) throw 'Message not found!!';
        else throw 'Something went wrong while trying to log in';
      })
      .catch((thisError) => {
        this.setState({ error: thisError.toString() });
      });
  }

  render() {
    const { newMessage } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Edit Message" />

        <View style={styles.sendMessageContainer}>
          <TextInput
            multiline
            style={styles.messageBox}
            onChangeText={(message) => this.setState({ newMessage: message })}
            value={newMessage}
            maxLength={70}
          />
          <TouchableOpacity onPress={
            () => this.save(this.route.params.chatId, this.route.params.messageId)
         }>
            <Icon name="send" color="black" size={40} />
          </TouchableOpacity>
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

  sendMessageContainer: {
    flex: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  messageBox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    fontSize: 18,
    padding: 6,
    textAlignVertical: 'top',
  },

});
