import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderPackaged from '../../screens/order/OrderPackaged';

const OrderPackagedNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderPackaged"
        component={OrderPackaged}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default OrderPackagedNavigator