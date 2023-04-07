import React, { Component } from 'react';
import {
  View, FlatList, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import DraftMessage from './draftMessage';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class Drafts extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.route = props.route;

    this.state = {
      draftMessages: [],
      error: '',
      draftToEdit: '',
      thisDraft: '',
      editable: false,
      saveEditChangesButtonDisabled: true,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.showDrafts();
    });
  }

  async send(chatId, draft) {
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
          this.navigation.goBack();
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

  async deleteDraft(item) {
    this.clearErrorMessages();
    try {
      const { draftMessages } = this.state;
      const updatedDraftMessages = draftMessages.filter((message) => message !== item);
      this.setState({ draftMessages: updatedDraftMessages });
      await AsyncStorage.setItem('draftMessages', JSON.stringify(updatedDraftMessages));
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async editDraft(item) {
    this.clearErrorMessages();
    try {
      this.setState({ draftToEdit: item });
      this.setState({ thisDraft: item });
      this.setState({ editable: true });
      this.setState({ saveEditChangesButtonDisabled: false });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async saveEdit() {
    try {
      const messages = await AsyncStorage.getItem('draftMessages');
      if (messages !== null) {
        const draftMessages = JSON.parse(messages);
        const index = draftMessages.findIndex((message) => message === this.state.draftToEdit);
        if (index !== -1) {
          draftMessages[index] = this.state.thisDraft;
          this.setState({ draftMessages });
          await AsyncStorage.setItem('draftMessages', JSON.stringify(draftMessages));
          this.setState({ draftToEdit: '' });
          this.setState({ thisDraft: '' });
          this.setState({ editable: false });
          this.setState({ saveEditChangesButtonDisabled: true });
        }
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async showDrafts() {
    this.clearErrorMessages();
    try {
      const messages = await AsyncStorage.getItem('draftMessages');
      if (messages !== null) {
        const draftMessages = JSON.parse(messages);
        this.setState({ draftMessages: draftMessages.map((message) => String(message)) });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  renderItem = ({ item }) => (
    <DraftMessage
      message={item}
      onDelete={() => this.deleteDraft(item)}
      onEdit={() => this.editDraft(item)}
      onSend={() => this.send(this.route.params.chatId, item)}
    />
  );

  render() {
    const { draftMessages } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Drafts" />
        <View style={GlobalStyle.wrapper}>
          <FlatList
            data={draftMessages}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.editDraft}>
          <TextInput
            multiline
            style={styles.messageBox}
            maxLength={70}
            onChangeText={(thisDraft) => this.setState({ thisDraft })}
            value={this.state.thisDraft}
            editable={this.state.editable}
          />
          <TouchableOpacity disabled={this.state.saveEditChangesButtonDisabled}>
            <Icon name="content-save" color="black" size={40} onPress={() => this.saveEdit()} />
          </TouchableOpacity>
        </View>
        <>
          {
            error
            && (
            <View style={[GlobalStyle.errorBox]}>
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
  editDraft: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
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
