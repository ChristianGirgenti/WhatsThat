import React, { Component } from 'react';
import { Text, View } from 'react-native';
import GlobalStyle from '../../styles/GlobalStyle';

export default class NavigationHeader extends Component {
  render() {
    const { title } = this.props;
    return (
      <View style={GlobalStyle.navigationHeaderSection}>
        <Text style={GlobalStyle.navigationHeaderTitle}>{title}</Text>
      </View>
    );
  }
}
