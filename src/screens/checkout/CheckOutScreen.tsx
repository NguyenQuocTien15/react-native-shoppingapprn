import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const CheckOutScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.flexDirectionAddress}>
        <Text style={styles.customText}>Address:</Text>
        <Text
          style={[
            styles.customText,
            {flex: 1, marginLeft: 20, fontStyle: 'italic'},
          ]}>
          HH2A Đơn Nguyên A, ngõ 562 Nguyễn Văn Cừ, Long Biên
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'orange'}}></View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 22, color: 'black'}}>Total</Text>
          <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
            â
          </Text>
        </View>
        <TouchableOpacity style={styles.touchCheckOut} onPress={ () => navigation.navigate('MyOrder') }>
          <Text style={styles.textCheckOut}>Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flexDirectionAddress: {
    flexDirection: 'row',
  },
  customText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  touchCheckOut: {
    backgroundColor: '#FA7189',
    borderRadius: 10,
    marginTop: 10,
  },
  textCheckOut: {
    color: 'white',
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
