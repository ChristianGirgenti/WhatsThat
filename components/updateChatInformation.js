import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, TextInput, FlatList, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';
import Contact from './contact';

export default class UpdateChatInformation extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.route = props.route;

    this.state = {
      error: '',
      newTitle: '',
      chatMembers: [],
      errorInputForm: '',
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.navigation.addListener('focus', async () => {
      await this.getChatMembers(this.route.params.chatId);
    });
  }

  async getContactPhoto(userId) {
    this.clearErrorMessages();

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/photo`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) return response.blob();
        if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw new Error('Something went wrong while retrieving your data');
      })
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        return data;
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async getChatMembers(chatId) {
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
          const updatedResponseJson = await Promise.all(responseJson.members.map(async (item) => {
            const photo = await this.getContactPhoto(item.user_id);
            return { ...item, photo };
          }));
          this.setState({ chatMembers: updatedResponseJson });
          this.setState({ isLoading: false });
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403) {
          // This is returning when user delete itself from
          // a chat that has still members partecipating.
          // When trying to get the remaining members, the API returns
          // a 403 because the user is forbidden to access the chat as it is not part of it anymore,
          // so the user will get send back to the display conversations screen.
          // To note is that the chat will still exist for the remaining members.
          console.log('You can not access this chat anymore');
          this.navigation.navigate('DisplayConversations');
        } else if (response.status === 404) {
          // This is returning when a user removes their
          // account from the chat and was the last one in the chat.
          // In this scenario, the chat is deleted, so when try to get the members,
          // the API call will return a 404 as the chat no longer exists.
          // The user is send back to the display conversations screen.
          console.log('The chat has been deleted');
          this.navigation.navigate('DisplayConversations');
        }
      })
      .catch((thisError) => {
        this.setState({ error: thisError.toString() });
      });
  }

  clearErrorMessages() {
    this.setState({ error: '' });
    this.setState({ errorInputForm: '' });
  }

  async updateTitle(chatId) {
    this.clearErrorMessages();
    const { newTitle } = this.state;

    if (newTitle === '') {
      this.setState({ error: 'No title has been inserted' });
      return;
    }

    let toSend = {};
    if (this.route.params.conversationTitle !== newTitle) { toSend = { name: newTitle }; }

    if (Object.keys(toSend).length === 0) {
      this.setState({ error: 'Nothing to update!' });
      return;
    }

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}`,
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
          this.navigation.navigate('DisplayConversations');
        } else if (response.status === 400) throw new Error('Bad Request');
        else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403) throw new Error('Can not update the chat title!');
        else if (response.status === 404) throw new Error('Chat not found!!');
        else throw new Error('Something went wrong while trying to log in');
      })
      .catch((thisError) => {
        this.setState({ errorInputForm: thisError.message });
      });
  }

  async addNewMembers(chatId) {
    this.navigation.navigate('AddNewMembersToChat', {
      chatId,
    });
  }

  async removeFromTheChat(chatId, userId) {
    this.clearErrorMessages();

    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`,
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
          this.getChatMembers(chatId);
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403) throw new Error('Cannot remove this member from the chat');
        else if (response.status === 404) throw new Error('Member not found!');
        else throw new Error('Something went wrong while retrieving your data');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  renderItem = ({ item }) => (
    <View style={styles.contactViewContainer}>
      <Contact
        name={item.first_name}
        lastName={item.last_name}
        imageSource={item.photo}
        style={styles.contact}
      />

      <TouchableOpacity
        style={styles.removeMember}
        onPress={() => this.removeFromTheChat(this.route.params.chatId, item.user_id)}
      >
        <Icon name="minus" color="red" size={40} />
      </TouchableOpacity>
    </View>
  );

  render() {
    const { errorInputForm } = this.state;
    const { newTitle } = this.state;
    const { error } = this.state;
    const { chatMembers } = this.state;
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
        <NavigationHeaderWithIcon navigation={this.navigation} title="Update Chat Information" />

        <View style={styles.bodyContainer}>
          <View style={styles.updateTitleSection}>
            <TextInput style={[GlobalStyle.baseText, GlobalStyle.textInputBox]} placeholder="New chat title" onChangeText={(title) => this.setState({ newTitle: title })} value={newTitle} />
            <>
              {
                            errorInputForm
                            && (
                            <View style={GlobalStyle.errorBox}>
                              <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                              <Text style={GlobalStyle.errorText}>{errorInputForm}</Text>
                            </View>
                            )
                            }
            </>
            <TouchableOpacity
              style={GlobalStyle.button}
              onPress={() => this.updateTitle(this.route.params.chatId)}
            >
              <Text style={GlobalStyle.buttonText}>Update Title</Text>
            </TouchableOpacity>
          </View>
          <View style={[GlobalStyle.wrapper, styles.contactListContainer]}>
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
            <Text style={[GlobalStyle.titleText, styles.chatMembersText]}>
              Current Chat members
            </Text>
            <FlatList
              data={chatMembers}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={GlobalStyle.button}
              onPress={() => this.addNewMembers(this.route.params.chatId)}
            >
              <Text style={[GlobalStyle.buttonText, styles.addMembersButtonText]}>
                Add New Members
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 15,
  },
  updateTitleSection: {
    alignItems: 'center',
  },
  contactListContainer: {
    marginTop: 10,
  },
  contactViewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 'thin',
    justifyContent: 'space-between',
  },
  removeMember: {
    justifyContent: 'center',
  },
  chatMembersText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  addMembersButtonText: {
    textAlign: 'center',
  },
});
