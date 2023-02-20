import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './components/login';
import SignUpScreen from './components/signup';
import Contact from './components/contact';
import DisplayContacts from './components/displayContacts'

class App extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
        </Stack.Navigator>
          {/* <Contact /> */}
          {/* <DisplayContacts style={styles.mainContainer} /> */}
      </NavigationContainer>
    
    );
    
  }
}

export default App

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1e9c6d',
    alignItems: 'center',
    justifyContent: 'center'
  },
});


