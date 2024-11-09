import {View, Text, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {orderRef} from '../../firebase/firebaseConfig';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    setLoading(true);
    const unsubscribe = orderRef
      .where('orderStatusId', '==', '6')
      .where('userId', '==', userId)
      .onSnapshot((snapShot: {docs: any[]}) => {
        const orderData = snapShot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

   const renderItem = ({item}: any) => (
     <View style={styles.itemListProduct}>
       <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
         <Image
           source={require('../../assets/images/logofs.jpg')}
           style={{width: 25, height: 25, marginRight: 10}}></Image>
         <Text style={styles.customText}>Fashion Store</Text>
       </View>

       <Text style={styles.orderDate}>Date: {item.timestamp}</Text>
       {item.items.map((orderItem, index) => (
         <View>
           <View key={index} style={styles.orderProduct}>
             <Image
               source={{uri: orderItem.imageUrl}}
               style={styles.productImage}
             />
             <View style={{flex: 1, flexDirection: 'column'}}>
               <Text
                 style={styles.customText}
                 numberOfLines={1}
                 ellipsizeMode="tail">
                 {orderItem.title}
               </Text>
               <Text style={{color: 'black', fontSize: 18}}>
                 Quantity: {orderItem.quantity}
               </Text>

               <View
                 style={{
                   flex: 1,
                   flexDirection: 'row',
                   justifyContent: 'space-between',
                   alignItems: 'flex-end',
                 }}>
                 <Text style={styles.customText}>
                   Price: ${orderItem.price * orderItem.quantity}
                 </Text>
                 <View
                   style={[
                     styles.flexDirection,
                     {
                       paddingVertical: 4,
                       borderRadius: 100,
                       alignItems: 'center',
                     },
                   ]}></View>
               </View>
             </View>
           </View>
         </View>
       ))}
       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
         <Text style={[styles.orderTotal, {color: 'black', fontSize: 20}]}>
           Total:
         </Text>
         <Text style={styles.customText}>
           ${item.totalPrice.toLocaleString()}
         </Text>
       </View>
       <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity
          style={[
            styles.touch,
            {
              backgroundColor: 'white',
              width: '35%',
            },
          ]}
          onPress={()=>Alert.alert('aa')}>
          <Text
            style={[
              styles.textTouch,
              {
                color: 'black',
              },
            ]}>
            Đánh giá
          </Text>
        </TouchableOpacity>
        </View>
     </View>
   );
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="blue" size="small"></ActivityIndicator>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  touch: {
    borderRadius: 5,
    borderColor: '#ff7891',
    borderWidth: 2,
  },
  textTouch: {
    fontSize: 20,
    paddingRight: 5,
    paddingLeft: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemListProduct: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
  },

  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderAddress: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 12,
    marginBottom: 10,
    color: 'gray',
  },
  orderProduct: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
});


