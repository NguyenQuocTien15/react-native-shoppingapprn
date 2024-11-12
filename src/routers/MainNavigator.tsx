import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CartScreen, FilterScreen, RatingScreen, ResultScreen } from '../screens';
import ProductDetail from '../screens/home/ProductDetail';

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
    </Stack.Navigator>
  )
}

export default MainNavigator