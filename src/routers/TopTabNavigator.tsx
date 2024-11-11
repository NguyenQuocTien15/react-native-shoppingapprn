import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import OrderHistoryNavigator from './Order/OrderHistoryNavigator';
import OrderReview from './Order/OrderReviewNavigator';
import OrderShippingNavigator from './Order/OrderShippingNavigator';
import OrderWaitingForConfirmationNavigator from './Order/OrderWaitingForConfirmationNavigator';
import OrderWaitingShipping from './Order/OrderWaitingShippingNavigator';
import OrderProcessingNavigator from './Order/OrderProcessingNavigator';
import OrderPackagedNavigator from './Order/OrderPackagedNavigator';

const Tab = createMaterialTopTabNavigator();
const TopTabNavigator = () => {
  
  return (
    <Tab.Navigator
      initialRouteName="OrderWaitingForConfirmation"
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
        name="OrderWaitingForConfirmation"
        component={OrderWaitingForConfirmationNavigator}
        options={{tabBarLabel: 'Chờ xác nhận'}}></Tab.Screen>
      <Tab.Screen
        name="OrderProcessingNavigator"
        component={OrderProcessingNavigator}
        options={{tabBarLabel: 'Đang xử lí'}}></Tab.Screen>
      <Tab.Screen
        name="OrderPackagedNavigator"
        component={OrderPackagedNavigator}
        options={{tabBarLabel: 'Đã đóng gói'}}></Tab.Screen>
      <Tab.Screen
        name="WaitingShipping"
        component={OrderWaitingShipping}
        options={{tabBarLabel: 'Chờ vận chuyển'}}></Tab.Screen>
      <Tab.Screen
        name="Shipping"
        component={OrderShippingNavigator}
        options={{tabBarLabel: 'Đang vận chuyển'}}></Tab.Screen>
      {/* <Tab.Screen name="Reviews" component={OrderReview}></Tab.Screen> */}
      <Tab.Screen
        name="History"
        component={OrderHistoryNavigator}
        options={{tabBarLabel: 'Lịch sử'}}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator