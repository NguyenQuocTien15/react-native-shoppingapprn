import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen} from '../screens';
import CheckOutScreen from '../screens/checkout/CheckOutScreen';
import MyOrders from '../screens/order/MyOrders';
import AddressSelector from '../screens/profiles/AddressScreen';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const CartNavigator = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('tabPress', e => {
        // Get the current route name
        const routeName =
          getFocusedRouteNameFromRoute(navigation.getState()) || 'CartScreen';

        // Check if the current route is CheckOut or MyOrders
        if (routeName === 'CheckOut' || routeName === 'MyOrder') {
          e.preventDefault(); // Prevent the default behavior
          // Navigate to CartScreen instead
          navigation.navigate('CartScreen');
        }
      });

      return unsubscribe;
    }, [navigation]),
  );

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
        options={{headerTitle: 'Tổng quan đơn hàng'}}
      />
      <Stack.Screen
        name="MyOrder"
        component={MyOrders}
        options={{title: 'My Orders'}}
      />
      <Stack.Screen name="Address" component={AddressSelector} />
    </Stack.Navigator>
  );
};

export default CartNavigator;
