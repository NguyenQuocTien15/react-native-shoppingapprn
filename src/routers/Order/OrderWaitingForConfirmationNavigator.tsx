import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderWaitingForConfirmationScreen from '../../screens/order/OrderWaitingForConfirmationScreen';

const OrderWaitingForConfirmation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="WaitingConfirm"
        component={OrderWaitingForConfirmationScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderWaitingForConfirmation;
