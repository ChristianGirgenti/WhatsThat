import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import PreviewConversation from './previewConversation';
import NavigationHeader from './screenForNavigation/navigationHeader';

export default class DisplayConversations extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      newConversationTitle: '',
      conversations: [],
      error: '',
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.setState({ newConversationTitle: '' });
      this.setState({ conversations: [] });
      this.viewAllChats();
      this.interval = setInterval(() => this.viewAllChats(), 5000);
      this.checkForScheduledDrafts();
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async checkForScheduledDrafts() {
    const today = new Date();
    const allExistingChatId = [];
    this.state.conversations.forEach((conversation) => {
      allExistingChatId.push(conversation.chat_id);
    });

    try {
      const draftObjects = await AsyncStorage.getItem('draftMessages');
      if (draftObjects !== null) {
        const drafts = JSON.parse(draftObjects);
        drafts.forEach((draft) => {
          if (allExistingChatId.includes(draft.chatId)) {
            const dateTimeParts = draft.date.split(' ');

            const dateParts = dateTimeParts[0].split('-');
            const timeParts = dateTimeParts[1].split(':');

            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const year = parseInt(dateParts[2], 10);

            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseInt(timeParts[2], 10);
            const draftScheduledDate = new Date(year, month, day, hours, minutes, seconds);

            if (draftScheduledDate < today) {
              this.sendScheduledDrafts(draft);
            }
          } else {
            this.removeDraftSentFromStorage(draft);
          }
        });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async removeDraftSentFromStorage(draft) {
    try {
      const draftObjects = await AsyncStorage.getItem('draftMessages');
      if (draftObjects !== null) {
        const drafts = JSON.parse(draftObjects);
        const index = drafts.findIndex((element) => element.message === draft.message
        && element.chatId === draft.chatId
        && element.date === draft.date);
        drafts.splice(index, 1);
        await AsyncStorage.setItem('draftMessages', JSON.stringify(drafts));
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async sendScheduledDrafts(draft) {
    this.clearErrorMessages();

    const toSend = {
      message: draft.message,
    };
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${draft.chatId}/message`,
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
          console.log('Draft sent!');
          this.removeDraftSentFromStorage(draft);
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 400) throw new Error(`Could not send the draft: ${draft.message}. Please try to send it manually`);
        else throw new Error('Something went wrong while trying to send a scheduled draft');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async viewAllChats() {
    this.clearErrorMessages();
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          const responseJson = await response.json();
          this.setState({ conversations: responseJson });
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw new Error('Something went wrong while retrieving your data');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async create() {
    const { newConversationTitle } = this.state;
    this.clearErrorMessages();
    if (newConversationTitle === '') {
      this.setState({ error: 'The conversation title can not be empty' });
      return;
    }
    const toSend = {
      name: newConversationTitle,
    };
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
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
        if (response.status === 201) {
          const data = await response.json();
          this.navigation.navigate('Conversation', {
            conversationTitle: newConversationTitle,
            chatId: data.chat_id,
          });
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

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  renderItem = ({ item }) => (
    <PreviewConversation
      chatId={item.chat_id}
      name={item.name}
      lastMessage={item.last_message.message}
      navigation={this.navigation}
      lastMessageSenderFirstName={item.last_message.author
        ? item.last_message.author.first_name : null}
      lastMessageSenderLastName={item.last_message.author
        ? item.last_message.author.last_name : null}
      lastMessageTime={item.last_message.timestamp}
    />
  );

  render() {
    const { conversations } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeader title="Conversations" />
        <View style={GlobalStyle.wrapper}>
          <FlatList
            data={conversations}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
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
          <View style={styles.newConversationContainer}>
            <TextInput
              style={styles.conversationTitleContainer}
              value={this.state.newConversationTitle}
              onChangeText={(newConversationTitle) => this.setState({ newConversationTitle })}
              placeholder="Conversation Title..."
            />
            <TouchableOpacity onPress={() => this.create()}>
              <Icon name="chat-plus" color="green" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newConversationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    backgroundColor: '#90EE90',

  },
  conversationTitleContainer: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    height: 40,
    width: '100%',
  },
  error: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});
