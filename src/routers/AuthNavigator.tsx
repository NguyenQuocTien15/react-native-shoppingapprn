import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeAuth, Login } from '../screens';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
    <StatusBar translucent backgroundColor={'white'}/>
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='HomeAuth' component={HomeAuth}/>
   </Stack.Navigator>
    </>
   
  )
}

export default AuthNavigator