import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class Schedule extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.route = props.route;
    this.state = {
      time: '',
      date: '',
      error: '',
    };
  }

  validateDateAndTime() {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    const regexTime = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!regexDate.test(this.state.date)) {
      return false;
    }
    if (!regexTime.test(this.state.time)) {
      return false;
    }
    return true;
  }

  clearErrorMessages() {
    this.setState({ error: '' });
  }

  schedule() {
    this.clearErrorMessages();
    if (!this.validateDateAndTime()) {
      this.setState({ error: 'Date or Time format are not valid' });
      return;
    }
    const thisDate = new Date(`${this.state.time} ${this.state.date}`);
    console.log(thisDate);
  }

  render() {
    const { message } = this.route.params;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Schedule" />
        <View style={GlobalStyle.wrapper}>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Draft Message: </Text>
            <Text style={GlobalStyle.baseText}>{message}</Text>
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Date: </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(date) => this.setState({ date })}
            />
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Time: </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(time) => this.setState({ time })}
            />
          </View>
          <View style={styles.form}>
            <TouchableOpacity style={GlobalStyle.button} onPress={() => this.schedule()}>
              Send
            </TouchableOpacity>
          </View>
        </View>
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
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: 'white',
  },
  fontBold: {
    fontWeight: 'bold',
  },
});
