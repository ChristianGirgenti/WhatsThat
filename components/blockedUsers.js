import React, { Component } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, FlatList, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import Contact from './contact';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class BlockedUsers extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      blockedUsers: [],
      error: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.getBlockedContacts();
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

  async getBlockedContacts() {
    this.clearErrorMessages();
    return fetch(
      'http://localhost:3333/api/1.0.0/blocked',
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
          this.setState({ blockedUsers: updatedResponseJson });
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

  async unblockContact(userIdToUnblock) {
    this.clearErrorMessages();
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userIdToUnblock}/block`,
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
          this.navigation.navigate('DisplayContacts');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 404) throw new Error('User not found!');
        else if (response.status === 400) throw new Error('You can not block yourself');
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
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => this.unblockContact(item.user_id)}
      >
        <Icon name="account-lock-open-outline" color="green" size={40} />
      </TouchableOpacity>
    </View>
  );

  render() {
    const { error } = this.state;
    const { blockedUsers } = this.state;
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
        <NavigationHeaderWithIcon navigation={this.navigation} title="Blocked Users" />
        <View style={GlobalStyle.wrapper}>
          <>
            {
             error && (
             <View style={GlobalStyle.errorBox}>
               <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
               <Text style={GlobalStyle.errorText}>{error}</Text>
             </View>
             )
            }
          </>
          <FlatList
            data={blockedUsers}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
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
    alignItems: 'center',
  },
  contact: {
    width: '70%',
    borderBottomWidth: 0,
  },
  unblockButton: {
    marginRight: 10,
    alignSelf: 'center',
  },
});
