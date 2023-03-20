import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from './contact';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeaderWithIcon from './screenForNavigation/navigationHeaderWithIcon';

export default class AddNewMembersToChat extends Component {
    constructor(props){
        super(props);

        this.state = {
            error: "",
          }

      }

    clearErrorMessages() {
        this.setState({error: ""})
    }

    addNewMember(){

    }

    renderItem = ({item}) => {
        console.log(item)
        return  <View style={styles.contactViewContainer}>
                    <Contact name={item.first_name} lastName={item.last_name} imageSource={item.photo} style={styles.contact}/>
                    <TouchableOpacity style={styles.unblockButton} onPress={() => this.addNewMember()}>
                                <Icon name="account-lock-open-outline" color={'green'} size={40} />
                    </TouchableOpacity>
                </View>
                
        
    }
 
    render() {
        return (
            <View style={GlobalStyle.mainContainer}>
                <NavigationHeaderWithIcon navigation={this.props.navigation} title="Add New Members To Chat" />
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
                    {/* <FlatList 
                        data={this.state.blockedUsers}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    /> */}
                </View>

            </View>

        );
        
      }
    }
