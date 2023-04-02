import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, TextInput, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      name: '',
      lastName: '',
      newEmail: '',
      newPassword: '',
      error: '',
      nameStored: '',
      lastNameStored: '',
      emailStored: '',
      photo: null,
    };
  }

  componentDidMount() {
    this.navigation.addListener('focus', () => {
      this.clearErrorMessages();
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
          name: responseJson.first_name,
          nameStored: responseJson.first_name,
          lastName: responseJson.last_name,
          lastNameStored: responseJson.last_name,
          newEmail: responseJson.email,
          emailStored: responseJson.email,
        });
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  validateInputForms() {
    const { name } = this.state;
    const { lastName } = this.state;
    const { newEmail } = this.state;
    const { newPassword } = this.state;
    const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;

    if (!(newEmail && name && lastName)) {
      this.setState({ error: 'The name, last name and email fields cannot be empty' });
      return false;
    }

    if (!(EmailValidator.validate(newEmail))) {
      this.setState({ error: 'The email is not valid' });
      return false;
    }
    if (newPassword) {
      if (!PASSWORD_REGEX.test(newPassword)) {
        if (newPassword.length < 8 || newPassword.length > 30) {
          this.setState({ error: 'Invalid password length.\nThe password must have a minimum of 8 characters and a maximum of 30.' });
        } else {
          this.setState({ error: 'Invalid password.\nThe password must have an uppercase letter, a lowercase letter, a special character and a number.' });
        }
        return false;
      }
    }
    return true;
  }

  async saveChanges() {
    this.clearErrorMessages();
    let toSend = {};
    const { name } = this.state;
    const { nameStored } = this.state;
    const { lastName } = this.state;
    const { lastNameStored } = this.state;
    const { newEmail } = this.state;
    const { emailStored } = this.state;
    const { newPassword } = this.state;

    if (!this.validateInputForms()) return;

    if (name !== nameStored) { toSend = { ...toSend, first_name: name }; }
    if (lastName !== lastNameStored) { toSend = { ...toSend, last_name: lastName }; }
    if (newEmail !== emailStored) { toSend = { ...toSend, email: newEmail }; }
    if (newPassword) { toSend = { ...toSend, password: newPassword }; }

    if (Object.keys(toSend).length === 0) {
      this.setState({ error: 'Nothing to update!' });
      return;
    }

    const userId = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}`,
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
          this.navigation.navigate('MyAccount');
        } else if (response.status === 400) throw new Error('Bad Request');
        else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          this.navigation.navigate('Login');
        } else if (response.status === 403 || response.status === 404) throw new Error('Can not update the information!');
        else throw new Error('Something went wrong while trying to log in');
      })
      .catch((thisError) => {
        this.setState({ error: thisError.message });
      });
  }

  async updatePhoto() {
    this.clearErrorMessages();
    this.navigation.navigate('Camera');
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  render() {
    const { photo } = this.state;
    const { name } = this.state;
    const { lastName } = this.state;
    const { newEmail } = this.state;
    const { error } = this.state;
    const { newPassword } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Edit Account" />

        <View style={styles.formContainer}>
          <>
            {
              photo
              && <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />
            }
          </>

          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.updatePhoto()}>
            <Text style={GlobalStyle.buttonText}>Change Photo</Text>
          </TouchableOpacity>
          <View>
            <View style={styles.formGroup}>
              <Text style={styles.labelText}>Name: </Text>
              <TextInput
                style={[GlobalStyle.baseText, GlobalStyle.textInputBox]}
                value={name}
                onChangeText={(newName) => this.setState({ name: newName })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.labelText}>Last Name: </Text>
              <TextInput
                style={[GlobalStyle.baseText, GlobalStyle.textInputBox]}
                value={lastName}
                onChangeText={(newLastName) => this.setState({ lastName: newLastName })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.labelText}>Email: </Text>
              <TextInput
                style={[GlobalStyle.baseText, GlobalStyle.textInputBox]}
                value={newEmail}
                onChangeText={(email) => this.setState({ newEmail: email })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.labelText}>Password: </Text>
              <TextInput
                style={[GlobalStyle.baseText, GlobalStyle.textInputBox]}
                value={newPassword}
                onChangeText={(password) => this.setState({ newPassword: password })}
                secureTextEntry
              />
            </View>
          </View>
          <TouchableOpacity style={GlobalStyle.button} onPress={() => this.saveChanges()}>
            <Text style={GlobalStyle.buttonText}>Save</Text>
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
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
