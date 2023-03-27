import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../../styles/GlobalStyle';

export default class NavigationHeaderWithIcon extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.title = props.title;
  }

  render() {
    return (
      <View style={[GlobalStyle.navigationHeaderSection, styles.titleHeaderSection]}>
        <TouchableOpacity onPress={() => this.navigation.goBack()}>
          <Icon name="arrow-left-bold-outline" color="black" size={32} />
        </TouchableOpacity>
        <Text style={[GlobalStyle.navigationHeaderTitle, styles.titleText]}>
          { this.title }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleHeaderSection: {
    justifyContent: 'flex-start',
  },
  titleText: {
    flex: 0.9,
  },
});
