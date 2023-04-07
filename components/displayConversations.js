import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text, ActivityIndicator,
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
      isLoading: true,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.setState({ newConversationTitle: '' });
      this.setState({ conversations: [] });
      this.viewAllChats();
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
          this.setState({ isLoading: false });
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
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
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
