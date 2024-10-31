
import React, { useCallback } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen} from '../screens';
import CheckOutScreen from '../screens/checkout/CheckOutScreen';
import TopTabNavigator from './TopTabNavigator';
import MyOrders from '../screens/order/MyOrders';
import AddressSelector from '../screens/profiles/AddressScreen';
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const CartNavigator = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('tabPress', e => {
        // Check if the current route is either CheckOut or MyOrders
        const routeName = getFocusedRouteNameFromRoute(navigation.getState());
        if (routeName === 'CheckOut' || routeName === 'MyOrder') {
          e.preventDefault(); // Prevent the default behavior
          // Optionally navigate to CartScreen or handle as needed
          navigation.navigate('CartScreen');
        }
      });

      return unsubscribe;
    }, [navigation]),
  );
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CheckOut"
          component={CheckOutScreen}
          options={{headerTitle: 'Tổng quan đơn hàng'}}></Stack.Screen>
        <Stack.Screen
          name="MyOrder"
          component={MyOrders}
          options={{title: 'My Orders'}}></Stack.Screen>
        <Stack.Screen name="Address" component={AddressSelector}></Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default CartNavigator;
