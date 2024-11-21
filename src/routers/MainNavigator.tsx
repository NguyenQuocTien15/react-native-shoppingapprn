
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CartScreen, ChatScreen, FilterScreen, RatingScreen, SearchResultsScreen } from '../screens';
import ProductDetail from '../screens/home/ProductDetail';
import TabNavigator from './TabNavigator';
import FilterResultScreen from '../screens/home/FilterResultScreen';
import ProductsCategoryScreen from '../screens/home/ProductsCategoryScreen';
import ProductsByOfferListScreen from '../screens/home/ProductsByOfferListScreen';
import OrderReview from './Order/OrderReviewNavigator';
import ReviewsProduct from '../screens/order/OrderReviewsScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      {/* <Stack.Screen name='Payment' component={AddPayment}/>
       */}
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="FilterResultScreen" component={FilterResultScreen} />
      <Stack.Screen
        name="SearchResultsScreen"
        component={SearchResultsScreen}
      />
      {/* @ts-ignore */}
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen
        name="ProductsCategoryScreen"
        component={ProductsCategoryScreen}
      />
      <Stack.Screen
        name="ProductsByOfferListScreen"
        component={ProductsByOfferListScreen}
      />
      {/* <Stack.Screen name='ResultScreen' component={ResultScreen}/> */}
      <Stack.Screen
        name="OrderReviewsScreen"
        component={ReviewsProduct}></Stack.Screen>
    </Stack.Navigator>
  );
  
}

export default MainNavigator
