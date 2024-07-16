import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CartScreen } from '../screens';

const CartNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
   <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='CartScreen' component={CartScreen}/>
   </Stack.Navigator>
  )
}

export default CartNavigator