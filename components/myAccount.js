import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';

export default class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      isLoading: true,
      name: '',
      lastName: '',
      email: '',
      error: '',
      photo: null,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.get_profile_image();
      this.getUserInformation();
    });
  }

  async get_profile_image() {
    this.clearErrorMessages();

    const userId = await AsyncStorage.getItem('whatsthat_user_id');
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

        this.setState({
          isLoading: false,
          photo: data,
        });
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async getUserInformation() {
    this.clearErrorMessages();

    const userId = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}`,
      {
        method: 'get',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw new Error('Something went wrong while retrieving your data');
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          name: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
        });
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async logout() {
    this.clearErrorMessages();
    return fetch(
      'http://localhost:3333/api/1.0.0/logout',
      {
        method: 'post',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else throw new Error('Something went wrong');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  edit() {
    this.clearErrorMessages();
    this.navigation.navigate('EditAccount');
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  render() {
    const { isLoading } = this.state;
    const { photo } = this.state;
    const { name } = this.state;
    const { lastName } = this.state;
    const { email } = this.state;
    const { error } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeader title="My Account" />
        <View style={styles.formContainer}>

          <>
            {
              photo
              && <Image source={{ uri: photo }} style={styles.imageDimensione} />
            }
          </>

          <Text style={[GlobalStyle.baseText, styles.paddingBottom, styles.paddingTop]}>
            {name}
          </Text>
          <Text style={[GlobalStyle.baseText, styles.paddingBottom]}>
            {lastName}
          </Text>
          <Text style={[GlobalStyle.baseText, styles.paddingBottom]}>
            {email}
          </Text>

          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.edit()}>
            <Text style={GlobalStyle.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.logout()}>
            <Text style={GlobalStyle.buttonText}>Logout</Text>
          </TouchableOpacity>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 15,
  },
  imageDimensione: {
    width: 100,
    height: 100,
  },
  paddingBottom: {
    paddingBottom: 20,
  },
  paddingTop: {
    paddingTop: 20,
  },
});
