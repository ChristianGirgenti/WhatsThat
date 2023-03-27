import React, { Component } from 'react';
import {
  Text, StyleSheet, Image, TouchableOpacity, View,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';

export default class Contact extends Component {
  render() {
    const { name } = this.props;
    const { lastName } = this.props;
    const { imageSource } = this.props;
    return (
      <TouchableOpacity>
        <View style={styles.contactContainer}>
          <Image source={imageSource} style={styles.contactProfileImage} />
          <Text style={[GlobalStyle.baseText, styles.contactText]}>
            {name}
            {' '}
            {lastName}
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
