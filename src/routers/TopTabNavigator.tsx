import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import OrderHistory from './Order/OrderHistory';
import OrderReview from './Order/OrderReview';
import OrderShipping from './Order/OrderShipping';
import OrderWaittingShipping from './Order/OrderWaittingShipping';
import OrderWaittingForConfirmation from './Order/OrderWaittingForConfirmation';

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
        name="Chờ xác nhận"
        component={OrderWaittingForConfirmation}></Tab.Screen>
      <Tab.Screen
        name="Chờ vận chuyển"
        component={OrderWaittingShipping}></Tab.Screen>
      <Tab.Screen name="OrderShipping" component={OrderShipping}></Tab.Screen>
      <Tab.Screen name="OrderReview" component={OrderReview}></Tab.Screen>
      <Tab.Screen name="OrderHistory" component={OrderHistory}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator