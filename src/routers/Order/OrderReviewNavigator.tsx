import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderReviewsScreen from '../../screens/order/OrderReviewsScreen';

const OrderReview = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OrderReviewsScreen"
        component={OrderReviewsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default OrderReview;
