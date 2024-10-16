import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import TopTabNavigator from '../../routers/TopTabNavigator';


const MyOrderScreen = () => {
  return(
    <View style={styles.container}>
      <TopTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // You can change the background color as needed
  },
});

export default MyOrderScreen;
