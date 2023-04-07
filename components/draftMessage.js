import React, { Component } from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class DraftMessage extends Component {
  render() {
    const { message } = this.props;
    const { onDelete } = this.props;
    const { onEdit } = this.props;
    const { onSend } = this.props;
    return (
      <View style={styles.draftMessageContainer}>
        <Text style={styles.content}>{message}</Text>
        <View style={styles.groupButton}>
          <TouchableOpacity>
            <Icon name="send" color="black" size={30} onPress={onSend} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="note-edit-outline" color="black" size={30} onPress={onEdit} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash-can-outline" color="black" size={30} onPress={onDelete} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    fontStyle: 'italic',
    color: 'black',
  },
  draftMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: 10,
  },
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
  },
});
