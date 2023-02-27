import React, { Component } from 'react';
import { Text, View} from 'react-native';
import GlobalStyle from '../../styles/GlobalStyle';

export default class NavigationHeader extends Component {

    constructor(props){
        super(props);
      }

    render() {
        return (
            <View style={GlobalStyle.navigationHeaderSection}>
                    <Text style={GlobalStyle.navigationHeaderTitle}>{this.props.title}</Text>
            </View>     
        );
        
    }
}
    
 
        