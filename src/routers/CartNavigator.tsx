import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen} from '../screens';
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
        name="MyOrder"
        component={MyOrderScreen}
        options={{headerTitle: 'My Orders'}}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default CartNavigator;
