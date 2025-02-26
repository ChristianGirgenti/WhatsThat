import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import Contact from './contact';
import NavigationHeader from './screenForNavigation/navigationHeader';

export default class DisplayContacts extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      contacts: [],
      error: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.getContacts();
    });
  }

  async getContacts() {
    this.clearErrorMessages();
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          const responseJson = await response.json();
          const updatedResponseJson = await Promise.all(responseJson.map(async (item) => {
            const photo = await this.getContactPhoto(item.user_id);
            return { ...item, photo };
          }));
          this.setState({ contacts: updatedResponseJson });
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

  async blockContact(userIdToBlock) {
    this.clearErrorMessages();
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userIdToBlock}/block`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          this.navigation.navigate('BlockedUsers');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 404) throw new Error('User not found!');
        else if (response.status === 400) throw new Error('You can not block yourself');
        else throw new Error('Something went wrong while trying to block the account');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async removeContact(userIdToRemove) {
    this.clearErrorMessages();

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userIdToRemove}/contact`,
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
          this.getContacts();
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 404) throw new Error('User not found!');
        else if (response.status === 400) throw new Error('You can not remove yourself as a contact');
        else throw new Error('Something went wrong while retrieving your data');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  renderItem = ({ item }) => (
    <View style={styles.contactViewContainer}>
      <Contact
        name={item.first_name}
        lastName={item.last_name}
        imageSource={item.photo}
        style={styles.contact}
      />
      <View style={styles.groupButton}>
        <TouchableOpacity
          style={styles.removeContactButton}
          onPress={() => this.removeContact(item.user_id)}
        >
          <Icon name="account-remove" color="red" size={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.blockContact(item.user_id)}>
          <Icon name="account-cancel-outline" color="red" size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const { error } = this.state;
    const { contacts } = this.state;
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
        <NavigationHeader title="My Contacts" />

        <View style={GlobalStyle.wrapper}>
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
          <FlatList
            data={contacts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={[GlobalStyle.button, styles.goToBlockedListButton]} onPress={() => this.navigation.navigate('BlockedUsers')}>
            <Text style={GlobalStyle.buttonText}>Blocked Users</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contactViewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 'thin',
    justifyContent: 'space-between',
  },
  contact: {
    width: '70%',
    borderBottomWidth: 0,
  },
  removeContactButton: {
    marginRight: 10,
    alignSelf: 'center',
  },
  goToBlockedListButton: {
    width: '100%',
    paddingVertical: 10,
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});
