import React, { Component } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity, View} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';


export default class PreviewConversation extends Component {

    constructor(props){
        super(props);
      }

      openConversation(){
        console.log(this.props.name)
        console.log(this.props.conversation)
      }
  
   
      render() {
        return (
            <TouchableOpacity  onPress={() => this.openConversation()}>
                <View style={styles.conversationContainer}>
                    <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png'}} style={styles.contactProfileImage} />
                    
                    <View style={styles.textContainer}>
                        <Text style={[GlobalStyle.baseText, styles.contactNameText]}>{this.props.name} {this.props.lastName}</Text>
                        <Text numberOfLines={1} style={[GlobalStyle.baseText, styles.previewConversationText]}>{this.props.conversation}</Text>
                        {/* <Text style={styles.contactNameText}>Christian Girgenti</Text> */}
                        {/* <Text numberOfLines={1} style={[GlobalStyle.baseText, styles.previewConversationText]}>This is a preview test and I want the text to not show anymore if too long because this is what I decided</Text> */}
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
            borderBottomWidth: 1
        },
        contactProfileImage: {
            alignSelf: 'flex-start',
            width: 50,
            height: 50
        },
        textContainer: {
            flex:1,
            flexDirection: 'column',
            marginLeft: 10
        },
        contactNameText:{
            fontWeight: 'bold'
        }
    });