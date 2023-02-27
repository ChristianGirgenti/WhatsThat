import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyle from '../../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class NavigationHeaderWithIcon extends Component {

    constructor(props){
        super(props);
      }

    render() {
        return (
            <View style={[GlobalStyle.navigationHeaderSection, styles.titleHeaderSection]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left-bold-outline" color={'black'} size={32} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.navigationHeaderTitle, styles.titleText]}>{this.props.title}</Text>
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    titleHeaderSection: {
      justifyContent: 'flex-start'
    },
    titleText: {
      flex: 0.9
   }
  });
    