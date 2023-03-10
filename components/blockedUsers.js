import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import NavigationHeader from './screenForNavigation/navigationHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class BlockedUsers extends Component {
//I CAN ONLY BLOCK USERS IN MY CONTACT LIST BUT SHOULDNT I BE ABLE TO BLOCK USERS IN THE USER LISTS INSTEAD AS WE CAN JUST REMOVE SOMEONE FROM THE CONTACT LIST? 
    constructor(props){
        super(props);

        this.state = {
            blockedUsers: [],
            error: "",
          }

      }

    // renderItem = ({item}) => {
    //     if (item.user_id != this.state.currentUserId)
    //     {
    //         return <View style={styles.contactViewContainer}>
    //                 <Contact name={item.given_name} lastName={item.family_name} imageSource={item.photo} style={styles.contact}/>
    //                 <TouchableOpacity style={[GlobalStyle.button, styles.addButton]} onPress={() => this.addContact(item.user_id)}>
    //                         <Text style={GlobalStyle.buttonText}>Add Contact</Text>
    //                 </TouchableOpacity>
    //                </View>
                
    //     }
    // }

  
 
    render() {
        return (
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Blocked Users" />
                <View style={GlobalStyle.wrapper}>
                    <>
                        {
                        this.state.error &&
                        <View style={GlobalStyle.errorBox}>
                            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
                            <Text style={GlobalStyle.errorText}>{this.state.error}</Text>
                        </View>
                        }
                    </>                    
                    <FlatList 
                        data={this.state.searchResults}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                </View>

            </View>

        );
        
      }
    }
