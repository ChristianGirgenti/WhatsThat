import React, { Component } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';

export default class PreviewConversation extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
  }

  openConversation() {
    const { name } = this.props;
    const { chatId } = this.props;

    this.navigation.navigate('Conversation', {
      conversationTitle: name,
      chatId,
    });
  }

  render() {
    const { name } = this.props;
    const { lastMessageTime } = this.props;
    const { lastMessage } = this.props;
    const { lastMessageSenderFirstName } = this.props;
    const { lastMessageSenderLastName } = this.props;
    return (
      <TouchableOpacity onPress={() => this.openConversation()}>
        <View style={styles.conversationContainer}>
          <View style={styles.textContainer}>
            <View style={styles.firstRow}>
              <Text style={[GlobalStyle.baseText, styles.contactNameText]}>{name}</Text>
              <Text>
                {lastMessageTime ? new Date(lastMessageTime).toLocaleString() : ''}
              </Text>
            </View>
            <Text numberOfLines={1} style={[GlobalStyle.baseText]}>
              {lastMessageSenderFirstName}
              {lastMessageSenderLastName ? ` ${lastMessageSenderLastName}: ` : ''}
              {lastMessage}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  conversationContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    height: 50,
  },
  contactNameText: {
    fontWeight: 'bold',
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
    marginRight: 10,
  },
});
