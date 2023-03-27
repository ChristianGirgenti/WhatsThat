import React, { Component } from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Message extends Component {
  constructor(props) {
    super(props);

    this.user_id = props.user_id;
    this.navigation = props.navigation;
    this.userName = props.userName;
    this.chatId = props.chatId;
    this.messageId = props.messageId;
    this.onPress = props.onPress;
    this.time = props.time;

    this.state = {
      myUserId: null,
      isMyMessage: false,
    };
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem('whatsthat_user_id');
    this.setState({ myUserId: userId });
    const { myUserId } = this.state;
    this.setState(
      {
        isMyMessage: myUserId.toString() === this.user_id.toString(),
      },
    );
  }

  render() {
    const { isMyMessage } = this.state;
    const { message } = this.props;
    return (
      <View style={[styles.message, isMyMessage
        ? styles.from_me : styles.other]}
      >
        <View style={styles.firstRow}>
          <Text style={styles.author}>{this.userName}</Text>
          <View style={styles.buttonGroup}>
            {isMyMessage && (
            <TouchableOpacity onPress={() => this.navigation.navigate('EditMessage', {
              message,
              chatId: this.chatId,
              messageId: this.messageId,
            })}
            >
              <Icon name="note-edit-outline" color="black" size={20} />
            </TouchableOpacity>
            )}
            {isMyMessage && (
            <TouchableOpacity onPress={
                async () => this.onPress(this.chatId, this.messageId)
}
            >
              <Icon name="trash-can-outline" color="black" size={20} />
            </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.content}>{message}</Text>
        <Text style={styles.time}>{this.time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    borderRadius: 15,
    padding: 5,
    margin: 5,
    width: '48%',
  },
  author: {
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    fontStyle: 'italic',
    color: '#ffffff',
  },
  other: {
    backgroundColor: 'limegreen',
  },
  from_me: {
    backgroundColor: 'skyblue',
    alignSelf: 'flex-end',
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
});
