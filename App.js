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
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Login" component={LogInScreen}/>
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
      </NavigationContainer>
    
    );
    
  }
}

export default App

