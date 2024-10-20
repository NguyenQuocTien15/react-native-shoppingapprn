import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import OrderHistory from './Order/OrderHistoryNavigator';
import OrderReview from './Order/OrderReviewNavigator';
import OrderShipping from './Order/OrderShippingNavigator';
import OrderWaittingShipping from './Order/OrderWaittingShippingNavigator';
import OrderWaittingForConfirmation from './Order/OrderWaittingForConfirmationNavigator';

const TopTabNavigator = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: '#ff7891',
          height: 2,
        },
        tabBarPressColor: '#ff7891',
      }}
      sceneContainerStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="WaittingConfirm"
        component={OrderWaittingForConfirmation}></Tab.Screen>
      <Tab.Screen
        name="WaittingShipping"
        component={OrderWaittingShipping}></Tab.Screen>
      <Tab.Screen name="Shipping" component={OrderShipping}></Tab.Screen>
      <Tab.Screen name="Reviews" component={OrderReview}></Tab.Screen>
      <Tab.Screen name="HistoryScreen" component={OrderHistory}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator