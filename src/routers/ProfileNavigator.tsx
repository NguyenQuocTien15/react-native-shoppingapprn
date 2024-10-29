import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileScreen} from '../screens';


import ChangePasswordScreen from '../screens/profiles/ChangePasswordScreen';

import PersonalDetailsScreen from '../screens/profiles/PersonalDetailsScreen';
import MyOrders from '../screens/order/MyOrders';
import AddressSelector from '../screens/profiles/AddressScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="Personal"
        component={PersonalDetailsScreen}
        options={{title: 'Personal'}}></Stack.Screen>
      <Stack.Screen
        name="MyOrder"
        component={MyOrders}
        options={{title: 'My Orders'}}></Stack.Screen>
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{title: 'Change password'}}></Stack.Screen>
      <Stack.Screen name="Address" component={AddressSelector}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
