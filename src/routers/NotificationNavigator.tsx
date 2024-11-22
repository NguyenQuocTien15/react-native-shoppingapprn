import {View, Text} from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from '../screens/notifications/NotificationScreen';


const NotificationNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        //@ts-ignore
        component={NotificationScreen}    
      />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
