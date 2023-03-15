import React, { Component } from 'react';
import { Text, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Message extends Component {

    constructor(props){
        super(props);
        this.state = {
            myUserId: null,
            isMyMessage: false
        }
      }

    async componentDidMount() {
        const myUserId = await AsyncStorage.getItem("whatsthat_user_id");
        this.setState({myUserId})
        this.setState({isMyMessage: this.state.myUserId.toString() === this.props.user_id.toString()})
    }

    render() {
        return (
            <View style={[styles.message, this.state.isMyMessage
            ? styles.from_me : styles.other]}>
                    <Text style={styles.author}>{this.props.userName}</Text>
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
            width: '40%' 
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
        }
    })