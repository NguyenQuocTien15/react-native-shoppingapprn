import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CartScreen, FilterScreen, RatingScreen, ResultScreen } from '../screens';
import ProductDetail from '../screens/home/ProductDetail';
import TabNavigator from './TabNavigator';
import OrderReviewsScreen from '../screens/order/OrderReviewsScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
      <Stack.Screen
        name="OrderReviews"
        component={OrderReviewsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigator