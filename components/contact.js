import React, { Component } from 'react';
import {
  Text, StyleSheet, Image, TouchableOpacity, View,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';

export default class Contact extends Component {
  constructor(props) {
    super(props);

    this.name = props.name;
    this.lastName = props.lastName;
    this.imageSource = props.imageSource;
  }

  render() {
    return (
      <TouchableOpacity>
        <View style={styles.contactContainer}>
          <Image source={this.imageSource} style={styles.contactProfileImage} />
          <Text style={[GlobalStyle.baseText, styles.contactText]}>
            {this.name}
            {' '}
            {this.lastName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contactProfileImage: {
    alignSelf: 'flex-start',
    width: 50,
    height: 50,
  },
  contactText: {
    marginLeft: 5,
    textAlign: 'center',
  },
});
