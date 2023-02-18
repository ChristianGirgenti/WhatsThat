import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet} from 'react-native';
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
            <View style={styles.container}>
                <Text style={[GlobalStyle.titleText, styles.title]}>My contacts</Text>
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
    container: {
        flex: 1
    },  
    listWrapper: {
        flex: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        padding: 5,
        marginTop: 50,
        marginBottom: 20,
        textAlign: 'center'
    },
})