import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';


export default class PreviewConversation extends Component {

    constructor(props){
        super(props);
      }

      openConversation(){
        this.props.navigation.navigate('Conversation', {
            conversationTitle: this.props.name,
            chatId: this.props.chatId,
            userName: this.props.userName
        });
      }
  
   
      render() {
        return (
            <TouchableOpacity  onPress={() => this.openConversation()}>
                <View style={styles.conversationContainer}>                    
                    <View style={styles.textContainer}>
                        <Text style={[GlobalStyle.baseText, styles.contactNameText]}>{this.props.name}</Text>
                        <Text numberOfLines={1} style={[GlobalStyle.baseText]}>{this.props.lastMessage}</Text>
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
        },
        textContainer: {
            flex:1,
            flexDirection: 'column',
            marginLeft: 10,
            height: 50
        },
        contactNameText:{
            fontWeight: 'bold'
        }
    });