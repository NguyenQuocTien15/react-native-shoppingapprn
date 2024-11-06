import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchResultsScreen, HomeScreen } from '../screens';
import OfferProductsList from '../screens/home/OfferProductsList';

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='HomeScreen' component={HomeScreen}/>
    <Stack.Screen name='SearchResultsScreen' component={SearchResultsScreen}/>
    <Stack.Screen name='OfferProductsList' component={OfferProductsList}/>

 
   </Stack.Navigator>
  )
}

export default HomeNavigator