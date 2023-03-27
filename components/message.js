import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



export default class Message extends Component {

    constructor(props){
        super(props);
        this.state = {
            myUserId: null,
            isMyMessage: false,
            error: ""
        }
      }

    async componentDidMount() {
        const myUserId = await AsyncStorage.getItem("whatsthat_user_id");
        this.setState({myUserId})
        this.setState({isMyMessage: this.state.myUserId.toString() === this.props.user_id.toString()})
    }

    async componentDidUpdate(prevProps) {
      if (prevProps.user_id !== this.props.user_id) {
        const myUserId = await AsyncStorage.getItem("whatsthat_user_id");
        this.setState({ myUserId });
        this.setState({
          isMyMessage:
            myUserId.toString() === this.props.user_id.toString(),
        });
      }
    }

 
    render() {
        return (
            <View style={[styles.message, this.state.isMyMessage
            ? styles.from_me : styles.other]}>
                    <View style={styles.firstRow}>
                        <Text style={styles.author}>{this.props.userName}</Text>
                        <View style={styles.buttonGroup}>
                            {this.state.isMyMessage && (
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("EditMessage", {
                                    message: this.props.message,
                                    chatId: this.props.chatId,
                                    messageId: this.props.messageId
                                })} >
                                    <Icon name="note-edit-outline" color={'black'} size={20} />
                                </TouchableOpacity>
                            )}

                            {this.state.isMyMessage && (
                                <TouchableOpacity onPress={async () => await this.props.onPress(this.props.chatId, this.props.messageId)}>
                                    <Icon name="trash-can-outline" color={'black'} size={20} />
                                </TouchableOpacity>
                            )}
                        </View>                        
                    </View> 
                    <Text style={styles.content}>{this.props.message}</Text>
                    <Text style={styles.time}>{this.props.time}</Text>
            </View> 

        );
      }
    }
    
    const styles = StyleSheet.create({
        message: {
            borderRadius: 15,
            padding: 5,
            margin: 5,
            width: '48%' 
        },
        author: {
            fontWeight: 'bold',
            color: '#333'
        },
        content: {
            fontStyle: 'italic',
            color: '#ffffff'
        },
        other: {
            backgroundColor: 'limegreen', 
        },
        from_me: {
            backgroundColor: 'skyblue',
            alignSelf: 'flex-end'
        },
        firstRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        buttonGroup: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '30%'
        }
    })

