import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen} from '../screens';
import CheckOutScreen from '../screens/checkout/CheckOutScreen';
import MyOrderScreen from '../screens/order/MyOrderScreen';

const CartNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOutScreen}
        options={{headerTitle: 'Check Out'}}></Stack.Screen>
      <Stack.Screen
        name="MyOrder"
        component={MyOrderScreen}
        options={{title: 'My Orders'}}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default CartNavigator;
