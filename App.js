import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './components/login';
import SignUpScreen from './components/signup';
import Home from './components/screenForNavigation/home';

class App extends Component {
  constructor(props){
    super(props); 
  }

  render() {
    const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    
    );
    
  }
}

export default App

//CURRENT ISSUES:
//TOASTER NOT WORKING ON SIGN UP SUCCESS.
//HEADER DUPLICATES WHEN CLICKING ON A CONVERSATION PREVIEW
//NOT SURE WHERE TO DECLERE THE CONST NAVIGATION


//TO DO:
//ADDING SOMETHING TO LOG OUT TO THE HOME PAGE IN THE BOTTOM TAB MAYBE?
//CREATE PAGE TO EDIT OWN DETAILS
//CREATE PAGE TO EDIT CONTACT DETAILS


