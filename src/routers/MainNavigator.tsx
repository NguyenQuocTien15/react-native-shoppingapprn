import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CartScreen, FilterScreen, ProductsByOfferListScreen, RatingScreen, ResultScreen,SearchResultsScreen } from '../screens';
import ProductDetail from '../screens/home/ProductDetail';
import TabNavigator from './TabNavigator';
import ProductScreen from '../screens/home/ProductsScreen';
import OfferProductsList from '../screens/home/ProductsByOfferListScreen';
import OffersList from '../screens/home/components/OffersList';
import ChatScreen from '../screens/home/ChatScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='Main' component={TabNavigator}/>
    <Stack.Screen name='ProductDetail' component={ProductDetail}/>
    <Stack.Screen name='RatingScreen' component={RatingScreen}/>
    <Stack.Screen name='CartScreen' component={CartScreen}/>
    {/* <Stack.Screen name='Payment' component={AddPayment}/>
    */}
    <Stack.Screen name='FilterScreen' component={FilterScreen}/>
    <Stack.Screen name='ResultScreen' component={ResultScreen}/>
    <Stack.Screen name='ProductScreen' component={ProductScreen}/>
    <Stack.Screen name='OffersList' component={OffersList}/>
    <Stack.Screen name='ProductsByOfferListScreen' component={ProductsByOfferListScreen}/>
    <Stack.Screen name='ChatScreen' component={ChatScreen}/>

    </Stack.Navigator>
  )
}

export default MainNavigator