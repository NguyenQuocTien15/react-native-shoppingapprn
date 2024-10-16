import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileScreen} from '../screens';
import MyOrderScreen from '../screens/order/MyOrderScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{title: 'Profile'}}/>
      <Stack.Screen name='MyOrders' component={MyOrderScreen} options={{title: 'My Orders'}}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
