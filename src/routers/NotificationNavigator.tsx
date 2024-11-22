import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from '../screens/notifications/NotificationScreen';

const NotificationNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationScreen"
        //@ts-ignore
        component={(props) => {
          // Kiểm tra dữ liệu từ route.params
          const isScroll = props.route.params?.data?.length > 0;
          return <NotificationScreen {...props} isScroll={isScroll} />;
        }}
        options={{ title: 'Notification' }}
        
      />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
