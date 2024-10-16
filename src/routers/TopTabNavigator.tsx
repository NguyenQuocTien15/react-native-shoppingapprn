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
          backgroundColor: 'black',
          height: 3,
        },
      }}
      sceneContainerStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Waitting"
        component={OrderWaittingForConfirmation}></Tab.Screen>
      <Tab.Screen
        name="WaittingShipping"
        component={OrderWaittingShipping}></Tab.Screen>
      <Tab.Screen name="OrderShipping" component={OrderShipping}></Tab.Screen>
      <Tab.Screen name="OrderReview" component={OrderReview}></Tab.Screen>
      <Tab.Screen name="OrderHistoryScreen" component={OrderHistory}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator