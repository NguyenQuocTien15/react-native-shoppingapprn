import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderShippingScreen from '../../screens/order/OrderShippingScreen';

const OrderShipping = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderShipping"
        component={OrderShippingScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderShipping;
