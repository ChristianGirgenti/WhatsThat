import React, {Component } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Message from './message';

export default class Conversation extends Component{

    constructor(props){
        super(props);

        this.state = {
            conversation: [
                {id: 1, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 2, user_id: 2, name: "Ronan", message: "Ain't nothing by a heartache"},
                {id: 3, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 4, user_id: 2, name: "Ronan", message: "Ain't nothing by a mistake"},
                {id: 5, user_id: 1, name: "Ash", message: "Tell me why?"},
                {id: 6, user_id: 2, name: "Ronan", message: "I never want to hear you say"},
                {id: 7, user_id: 1, name: "Ash", message: "I want it that way"},
                {id: 8, user_id: 2, name: "Ronan", message: "Am I your fire? Your one desire?"},
                {id: 9, user_id: 1, name: "Ash", message: "No, don't call here no more creep!"},
                {id: 10, user_id: 2, name: "Ronan", message: "I never want to hear you say"},
                {id: 11, user_id: 1, name: "Ash", message: "I want it that way"},
                {id: 12, user_id: 1, name: "Ash", message: "Am I your fire? Your one desire?"},
                {id: 13, user_id: 2, name: "Ronan", message: "No, don't call here no more creep!"},
            ],
            message: ""
        }
    }

    renderItem = ({item}) => {
        return <Message name={item.name} message={item.message} user_id={item.user_id} />
    }

    send(){
        console.log(this.state.message)
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={GlobalStyle.titleText}>Ronan</Text>
                </View>

                <View style={styles.listWrapper}>
                    <FlatList 
                        data={this.state.conversation}
                        renderItem={this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                </View>
                <View style={styles.sendMessageContainer}>
                    {/* TEXT INPUT DOESN'T STRETCH IN HEIGHT SO I HAVE A MAX LENGHT OF 70 TO GIVE A BETTER USEr experience */}
                    <TextInput
                        multiline={true} 
                        style={styles.messageBox} 
                        placeholder="Message" 
                        onChangeText={(message) => this.setState({message})} 
                        value={this.state.message}
                        maxLength={70}
                        />
                    <TouchableOpacity style={styles.sendButton} onPress={() => this.send()}>
                        <Image style={styles.sendMessageImage} source={require('../img/sendIcon.png')} />
                    </TouchableOpacity>
                </View>        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listWrapper: {
        flex: 15
    },
    titleContainer: {
        flex:1,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 20,
        padding: 10
    },
    sendMessageContainer: {
        flex:2,
        flexDirection: 'row',
        backgroundColor: '#25D366',
        alignItems: 'stretch'
    },
    messageBox :{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        fontSize: 18,
        padding:6,
        textAlignVertical: 'top'
    },
    sendButton:{

    },
    sendMessageImage:{
        width: 64,
        height: 64,
        alignSelf: 'center'
    }
})

