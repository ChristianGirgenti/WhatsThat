import React, { Component } from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Contact from './contact';

export default class DisplayContacts extends Component{

    constructor(props){
        super(props);

        this.state = {
            contacts: [
                {name: "Ash", lastName: "Williams"},
                {name: "Ronan", lastName: "Smith"},
                {name: "Christian", lastName: "Girgenti"},
                {name: "Ash", lastName: "Williams"},
                {name: "Ronan", lastName: "Smith"},
                {name: "Christian", lastName: "Girgenti"},
                {name: "Ash", lastName: "Williams"},
                {name: "Ronan", lastName: "Smith"},
                {name: "Christian", lastName: "Girgenti"},
                {name: "Ash", lastName: "Williams"},
                {name: "Ronan", lastName: "Smith"},
                {name: "Christian", lastName: "Girgenti"},
                {name: "Ash", lastName: "Williams"},
                {name: "Ronan", lastName: "Smith"},
                {name: "Christian", lastName: "Girgenti"},
            ]
        }
    }

    renderItem = ({item}) => {
        console.log(item)
        return <Contact name={item.name} lastName={item.lastName}/>
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <View style={GlobalStyle.navigationHeaderSection}>
                    <Text style={GlobalStyle.navigationHeaderTitle}>My Contacts</Text>
                </View>
                <View style={styles.listWrapper}>
                    <FlatList 
                        data={this.state.contacts}
                        renderItem= {this.renderItem}
                        keyExtractor={(item,index) => index.toString()}
                    />
                </View>       
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listWrapper: {
        flex: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        padding: 5,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center'
    },
})