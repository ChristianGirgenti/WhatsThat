import React, { Component } from 'react';
import { Text, StyleSheet, View} from 'react-native';


export default class Message extends Component {

    constructor(props){
        super(props);
      }

      render() {
        return (
            <View style={[styles.message, this.props.user_id === 1 ? styles.from_me : styles.other]}>
                    <Text style={styles.author}>{this.props.name}</Text>
                    <Text style={styles.content}>{this.props.message}</Text>
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
            alignSelf: 'flex-end',
            backgroundColor: 'limegreen', 
        },
        from_me: {
            backgroundColor: 'skyblue'
        }
    })