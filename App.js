import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import LogInScreen from './components/login';
import SignUpScreen from './components/signup';
import Contact from './components/contact';
import DisplayContacts from './components/displayContacts'

class App extends Component {
  constructor(props){
    super(props); 
  }


  //QUESTION 1: IS IT BETTER TO GIVE A FIX WIDTH OR USE % FOR TEXT INPUT FORM?
  //QUESTION 2: SCROLLVIEW DID NOT ALLOWE ME TO USE FLEX PROPERLY. CAN I USE NORMAL VIEW FOR THE LOGIN AND SIGN UP FORM ?
  render() {
    return (
      <View style={styles.mainContainer}>
        {/* <SignUpScreen /> */}
        {/* <LogInScreen /> */}
        {/* <Contact /> */}
        <DisplayContacts />
      </View>
    );
    
  }
}

export default App

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1e9c6d',
    alignItems: 'center',
    justifyContent: 'center'
  },
});


