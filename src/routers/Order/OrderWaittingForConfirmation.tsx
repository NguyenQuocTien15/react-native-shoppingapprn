import React from 'react';
import OrderWaittingForConfirmationScreen from '../../screens/order/OrderWattingForConfirmationScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const OrderWaittingForConfirmation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Chờ xác nhận"
        component={OrderWaittingForConfirmationScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderWaittingForConfirmation;
