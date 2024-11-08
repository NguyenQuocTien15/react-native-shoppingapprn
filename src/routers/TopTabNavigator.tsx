import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import OrderHistory from './Order/OrderHistoryNavigator';
import OrderReview from './Order/OrderReviewNavigator';
import OrderShipping from './Order/OrderShippingNavigator';
import OrderWaitingForConfirmation from './Order/OrderWaitingForConfirmationNavigator';
import OrderWaitingShipping from './Order/OrderWaitingShippingNavigator';
import OrderProcessing from '../screens/order/OrderProcessing';
import OrderPackaged from '../screens/order/OrderPackaged';

const Tab = createMaterialTopTabNavigator();
const TopTabNavigator = () => {
  
  return (
    <Tab.Navigator
      initialRouteName="WaitingConfirm"
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
        component={OrderWaitingForConfirmation}
        options={{tabBarLabel: 'Chờ xác nhận'}}></Tab.Screen>
      <Tab.Screen
        name="OrderProcessing"
        component={OrderProcessing}
        options={{tabBarLabel: 'Đang xử lí'}}></Tab.Screen>
      <Tab.Screen
        name="OrderPackaged"
        component={OrderPackaged}
        options={{tabBarLabel: 'Đã đóng gói'}}></Tab.Screen>
      <Tab.Screen
        name="WaitingShipping"
        component={OrderWaitingShipping}
        options={{tabBarLabel: 'Chờ vận chuyển'}}></Tab.Screen>
      <Tab.Screen
        name="Shipping"
        component={OrderShipping}
        options={{tabBarLabel: 'Đang vận chuyển'}}></Tab.Screen>
      {/* <Tab.Screen name="Reviews" component={OrderReview}></Tab.Screen> */}
      <Tab.Screen
        name="History"
        component={OrderHistory}
        options={{tabBarLabel: 'Lịch sử'}}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default TopTabNavigator