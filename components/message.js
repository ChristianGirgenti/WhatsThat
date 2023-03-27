import React, { Component } from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Message extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      isMyMessage: false,
    };
  }

  async componentDidMount() {
    const myUserId = await AsyncStorage.getItem('whatsthat_user_id');
    const { userId } = this.props;
    this.setState(
      {
        isMyMessage: myUserId.toString() === userId.toString(),
      },
    );
  }

  async componentDidUpdate(prevProps) {
    const { userId } = this.props;
    if (prevProps.userId !== userId) {
      const myUserId = await AsyncStorage.getItem('whatsthat_user_id');
      this.setState({
        isMyMessage:
          myUserId.toString() === userId.toString(),
      });
    }
  }

  render() {
    const { isMyMessage } = this.state;
    const { message } = this.props;
    const { userName } = this.props;
    const { chatId } = this.props;
    const { messageId } = this.props;
    const { time } = this.props;
    const { onPress } = this.props;
    return (
      <View style={[styles.message, isMyMessage
        ? styles.from_me : styles.other]}
      >
        <View style={styles.firstRow}>
          <Text style={styles.author}>{userName}</Text>
          <View style={styles.buttonGroup}>
            {isMyMessage && (
            <TouchableOpacity onPress={() => this.navigation.navigate('EditMessage', {
              message,
              chatId,
              messageId,
            })}
            >
              <Icon name="note-edit-outline" color="black" size={20} />
            </TouchableOpacity>
            )}
            {isMyMessage && (
            <TouchableOpacity onPress={
                async () => onPress(chatId, messageId)
}
            >
              <Icon name="trash-can-outline" color="black" size={20} />
            </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.content}>{message}</Text>
        <Text style={styles.time}>{time}</Text>
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
