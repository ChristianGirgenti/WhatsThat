import React, { Component } from 'react';
import { View, FlatList, StyleSheet} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import PreviewConversation from './previewConversation';

export default class DisplayConversations extends Component{

    constructor(props){
        super(props);

        this.state = {
            conversations: [
                {name: "Ash", lastName: "Williams", conversation:"hello, how are you?"},
                {name: "Ronan", lastName: "Smith", conversation:"what's up dude?"},
                {name: "Christian", lastName: "Girgenti", conversation:"see you tomorrow then"},
                {name: "Natalie", lastName: "Williams", conversation:"This is just a text to check the lenght get cut off when about to go to two lines"}
            ]
        }
    }

    renderItem = ({item}) => {
        console.log(item)
        return <PreviewConversation name={item.name} lastName={item.lastName} conversation={item.conversation} />
    }

    render(){
        return(
            <View style={GlobalStyle.mainContainer}>
                <View style={styles.listWrapper}>
                    <FlatList 
                        data={this.state.conversations}
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
        flex: 15
    }
})