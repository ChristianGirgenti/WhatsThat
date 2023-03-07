import React, { Component } from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import Contact from './contact';
import NavigationHeader from './screenForNavigation/navigationHeader';

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
                <NavigationHeader title="My Contacts" />

                <View style={GlobalStyle.wrapper}>
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