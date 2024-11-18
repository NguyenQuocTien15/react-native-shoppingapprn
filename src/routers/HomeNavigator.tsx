
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FilterScreen, HomeScreen, ProductsScreen } from '../screens';

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='HomeScreen' component={HomeScreen}/>
    <Stack.Screen name='ProductsScreen' component={ProductsScreen}/>
    {/* <Stack.Screen name='FilterScreen' component={FilterScreen}/> */}
   </Stack.Navigator>
  )
}

export default HomeNavigator
