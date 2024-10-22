import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import OrderHistory from './Order/OrderHistoryNavigator';
import OrderReview from './Order/OrderReviewNavigator';
import OrderShipping from './Order/OrderShippingNavigator';
import OrderWaitingForConfirmation from './Order/OrderWaitingForConfirmationNavigator';
import OrderWaitingShipping from './Order/OrderWaitingShippingNavigator';





const TopTabNavigator = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: '#ff7891',
          height: 1,
        },
        tabBarPressColor: '#ff7891',
        tabBarLabelStyle: {fontSize: 14}, 
        tabBarActiveTintColor: '#ff7891', 
        tabBarInactiveTintColor: 'black',
        
      }}
      sceneContainerStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="WaitingConfirm"
        component={OrderWaitingForConfirmation}></Tab.Screen>
      <Tab.Screen
        name="WaitingShipping"
        component={OrderWaitingShipping}></Tab.Screen>
      <Tab.Screen name="Shipping" component={OrderShipping}></Tab.Screen>
      <Tab.Screen name="Reviews" component={OrderReview}></Tab.Screen>
      <Tab.Screen name="History" component={OrderHistory}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator