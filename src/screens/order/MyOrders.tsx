import { View, Text } from 'react-native'
import React from 'react'
import TopTabNavigator from '../../routers/TopTabNavigator'

const MyOrders = () => {
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop:15,
          backgroundColor:'white',
          color:'black'
        }}>
        My Orders
      </Text>
      <TopTabNavigator />
    </View>
  );
}

export default MyOrders