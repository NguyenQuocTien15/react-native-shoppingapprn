import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderProcessing from '../../screens/order/OrderProcessing';

const OrderProcessingNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderProcessing"
        component={OrderProcessing}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default OrderProcessingNavigator