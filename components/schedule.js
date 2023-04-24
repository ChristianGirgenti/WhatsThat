import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const regexDate = /^(0?[1-9]|[1-2][0-9]|3[0-1])-(0?[1-9]|1[0-2])-\d{4}$/;
    const regexTime = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

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

  async schedule(draft) {
    this.clearErrorMessages();
    if (!this.validateDateAndTime()) {
      this.setState({ error: 'Date or Time format are not valid' });
      return;
    }
    const dateString = this.state.date;
    const timeString = this.state.time;

    const dateTimeFormatted = `${dateString} ${timeString}`;
    const dateParts = dateString.split('-');
    const timeParts = timeString.split(':');

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    const selectedDate = new Date(year, month, day, hours, minutes, seconds);
    const today = new Date();

    if (selectedDate < today) {
      this.setState({ error: 'This is a messaging app, not a time machine!' });
      return;
    }

    const draftObjects = await AsyncStorage.getItem('draftMessages');
    if (draftObjects !== null) {
      const drafts = JSON.parse(draftObjects);
      drafts[draft.index].date = dateTimeFormatted;
      await AsyncStorage.setItem('draftMessages', JSON.stringify(drafts));
    }
    this.navigation.goBack();
  }

  render() {
    const { draft } = this.route.params;
    const { error } = this.state;
    return (
      <View style={GlobalStyle.mainContainer}>
        <NavigationHeaderWithIcon navigation={this.navigation} title="Schedule" />
        <View style={GlobalStyle.wrapper}>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Draft Message: </Text>
            <Text style={GlobalStyle.baseText}>{draft.message}</Text>
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Date (DD-MM-YYYY): </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(date) => this.setState({ date })}
            />
          </View>
          <View style={styles.form}>
            <Text style={[GlobalStyle.baseText, styles.fontBold]}>Time (HH:MM:SS): </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(time) => this.setState({ time })}
            />
          </View>
          <View style={styles.form}>
            <TouchableOpacity style={GlobalStyle.button} onPress={() => this.schedule(draft)}>
              <Text style={GlobalStyle.buttonText}>Schedule</Text>
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
