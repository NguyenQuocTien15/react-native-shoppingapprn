import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';

const OrderHistory = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderHistory;
