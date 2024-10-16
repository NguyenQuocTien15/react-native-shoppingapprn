import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textCart}>Carts</Text>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textCart: {
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    textAlign:'center'
  },
});
