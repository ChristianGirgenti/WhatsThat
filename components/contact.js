import React, { Component } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity, View} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';


export default class Contact extends Component {

    constructor(props){
        super(props);
      }

      openContact(){
        console.log(this.props.name)
      }
  
   
      render() {
        return (
            <TouchableOpacity  onPress={() => this.openContact()}>
                <View style={styles.contactContainer}>
                    <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png'}} style={styles.contactProfileImage} />
                    <Text style={[GlobalStyle.baseText, styles.contactText]}>{this.props.name} {this.props.lastName}</Text>
                </View>
            </TouchableOpacity>      
        );
        
      }
    }
    
    const styles = StyleSheet.create({
        contactContainer: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'white',
            borderRadius: 4,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 10
        },
        contactProfileImage: {
            alignSelf: 'flex-start',
            width: 50,
            height: 50
        },
        contactText: {
            marginLeft: 5,
            textAlign: 'center'
        }
    });