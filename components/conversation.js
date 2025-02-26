import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import Message from './message';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class Conversation extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.route = props.route;

    this.state = {
      conversation: [],
      messages: [],
      thisMessage: '',
      error: '',
    };

    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.viewSingleChatDetail(this.route.params.chatId);
      this.interval = setInterval(() => this.viewSingleChatDetail(this.route.params.chatId), 5000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderItem = ({ item }) => (
    <Message
      userName={`${item.author.first_name} ${item.author.last_name}`}
      message={item.message}
      messageId={item.message_id}
      userId={item.author.user_id}
      onPress={this.deleteMessage}
      time={new Date(item.timestamp).toLocaleString()}
      navigation={this.navigation}
      chatId={this.route.params.chatId}
    />
  );

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  async deleteMessage(chatId, messageId) {
    this.clearErrorMessages();

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          this.viewSingleChatDetail(chatId);
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 404) throw new Error('Message not found!');
        else if (response.status === 400) throw new Error('You can not delete this message');
        else throw new Error('Something went wrong while retrieving your data');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async saveDraft(chatId) {
    const { thisMessage } = this.state;
    if (thisMessage === '') {
      return;
    }
    const draftMessages = await AsyncStorage.getItem('draftMessages');
    const draftObject = {
      message: thisMessage,
      chatId,
      date: '14-01-2080 00:00:00',
    };
    if (draftMessages == null) {
      const newDraftMessages = [draftObject];
      await AsyncStorage.setItem('draftMessages', JSON.stringify(newDraftMessages));
    } else {
      const existingDraftMessages = JSON.parse(draftMessages);
      existingDraftMessages.push(draftObject);
      await AsyncStorage.setItem('draftMessages', JSON.stringify(existingDraftMessages));
    }
    this.setState({ thisMessage: '' });
  }

  async send(chatId) {
    const { thisMessage } = this.state;
    this.clearErrorMessages();
    if (thisMessage === '') {
      this.setState({ error: 'Write something in the message box to send a message' });
      return;
    }
    const toSend = {
      message: thisMessage,
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
          this.setState({ thisMessage: '' });
          this.viewSingleChatDetail(chatId);
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

  async viewSingleChatDetail(chatId) {
    this.clearErrorMessages();
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          const responseJson = await response.json();
          this.setState({ conversation: responseJson });
          const { conversation } = this.state;
          this.setState({ messages: conversation.messages });
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403) throw new Error('Can not access this chat');
        else if (response.status === 404) {
          console.log('Chat not found');
          clearInterval(this.interval);
          this.navigation.navigate('DisplayConversation');
        } else throw new Error('Something went wrong while retrieving your data');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  updateChatInformation(chatId, conversationTitle) {
    this.navigation.navigate('UpdateChatInformation', {
      chatId,
      conversationTitle,
    });
  }

  goToDraft(chatId) {
    this.navigation.navigate('Drafts', {
      chatId,
    });
  }

  render() {
    const { conversationTitle } = this.route.params;
    const { chatId } = this.route.params;
    const { messages } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <View style={styles.titleSection}>
          <NavigationHeaderWithIcon navigation={this.navigation} title={conversationTitle} />
          <TouchableOpacity onPress={() => this.goToDraft(chatId)}>
            <Icon name="email-open" color="black" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.updateChatInformation(chatId, conversationTitle)}>
            <Icon name="note-edit-outline" color="black" size={30} />
          </TouchableOpacity>
        </View>

        <View style={GlobalStyle.wrapper}>
          <FlatList
            data={messages}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            inverted
          />
        </View>
        <>
          {
            error
            && (
            <View style={[GlobalStyle.errorBox, styles.error]}>
              <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
              <Text style={GlobalStyle.errorText}>{error}</Text>
            </View>
            )
          }
        </>
        <View style={styles.sendMessageContainer}>
          <TextInput
            multiline
            style={styles.messageBox}
            placeholder="Message"
            onChangeText={(thisMessage) => this.setState({ thisMessage })}
            value={this.state.thisMessage}
            maxLength={70}
          />
          <TouchableOpacity onPress={() => this.send(chatId)}>
            <Icon name="send" color="black" size={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.saveDraft(chatId)}>
            <Icon name="content-save" color="black" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendMessageContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#25D366',
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
  },
});
