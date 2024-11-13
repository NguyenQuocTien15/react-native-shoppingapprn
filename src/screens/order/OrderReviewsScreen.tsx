import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const ReviewsProduct = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 35,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'black',
          }}>
          Đánh giá
        </Text>
      </View>
      <View
        style={{backgroundColor: 'black', height: 200, marginTop: 20}}></View>

      <ScrollView style={{flex: 1}}>
        
      </ScrollView>
      <TouchableOpacity style={styles.touchCheckOut}>
        <Text style={styles.textCheckOut}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewsProduct;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  touchCheckOut: {
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ff7891',
  },
  textCheckOut: {
    color: 'white',
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
