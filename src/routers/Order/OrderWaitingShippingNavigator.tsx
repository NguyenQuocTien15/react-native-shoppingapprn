import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderWaitingShippingScreen from '../../screens/order/OrderWaitingShippingScreen';

const OrderWaitingShipping = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderWaitingShipping"
        component={OrderWaitingShippingScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderWaitingShipping;
