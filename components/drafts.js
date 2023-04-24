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
      drafts: [],
      thisChatDrafts: [],
      error: '',
      draftToEdit: '',
      thisDraftMessage: '',
      editable: false,
      saveEditChangesButtonDisabled: true,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.showDrafts();
    });
  }

  async send(draft) {
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
      const { drafts } = this.state;
      const updatedDrafts = drafts.splice(item.index, 1);
      this.setState({ drafts: updatedDrafts });
      await AsyncStorage.setItem('draftMessages', JSON.stringify(drafts));
      this.showDrafts();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async editDraft(item) {
    this.clearErrorMessages();
    try {
      this.setState({ draftToEdit: item });
      this.setState({ thisDraftMessage: item.message });
      this.setState({ editable: true });
      this.setState({ saveEditChangesButtonDisabled: false });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async saveEdit() {
    try {
      const { draftToEdit } = this.state;
      const draftObjects = await AsyncStorage.getItem('draftMessages');
      if (draftObjects !== null) {
        const drafts = JSON.parse(draftObjects);
        drafts[draftToEdit.index].message = this.state.thisDraftMessage;
        this.setState({ drafts });
        await AsyncStorage.setItem('draftMessages', JSON.stringify(drafts));
        this.showDrafts();

        this.setState({ draftToEdit: '' });
        this.setState({ thisDraftMessage: '' });
        this.setState({ editable: false });
        this.setState({ saveEditChangesButtonDisabled: true });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async showDrafts() {
    this.clearErrorMessages();
    try {
      const draftObjects = await AsyncStorage.getItem('draftMessages');
      if (draftObjects !== null) {
        const drafts = JSON.parse(draftObjects);
        this.setState({ drafts });

        // The code below is used to keep track of the index
        // that the drafts have in the list of all drafts,
        // even when they are filtered to show only the
        // drafts specific to the current chat.
        // E.g. If a draft has index 5 in the all draft list
        // but it is the first draft of the current chat,
        // it will still have a property that stores the index 5.

        const thisChatDrafts = drafts
          .filter((draft) => draft.chatId === this.route.params.chatId)
          .map((draft) => {
            const index = drafts.findIndex((message) => message === draft);
            return { ...draft, index };
          });
        this.setState({ thisChatDrafts });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async schedule(draft) {
    this.navigation.navigate('Schedule', {
      draft,
    });
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  renderItem = ({ item }) => (
    <DraftMessage
      message={item.message}
      onDelete={() => this.deleteDraft(item)}
      onEdit={() => this.editDraft(item)}
      onSend={() => this.send(item)}
      onSchedule={() => this.schedule(item)}
    />
  );

  render() {
    const { thisChatDrafts } = this.state;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Drafts" />
        <View style={GlobalStyle.wrapper}>
          <FlatList
            data={thisChatDrafts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.editDraft}>
          <TextInput
            multiline
            style={styles.messageBox}
            maxLength={70}
            onChangeText={(thisDraftMessage) => this.setState({ thisDraftMessage })}
            value={this.state.thisDraftMessage}
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
