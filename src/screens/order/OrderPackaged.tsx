import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {orderRef} from '../../firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { colors } from '../../constants/colors';


const OrderPackaged = () => {
  const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      console.log('No user is signed in.');
    }
  }, []);
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const unsubscribe = orderRef
      .where('orderStatusId', '==', '3')
      .where('userId', '==', userId)
      .onSnapshot(
        (snapshot: {docs: any[]}) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
          setLoading(false);
        },
        (error: any) => {
          console.error('Error fetching real-time orders: ', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [userId]);
  const renderItem = ({item} : any) => (
    <View style={styles.itemListProduct}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop:5}}>
        <Image
          source={require('../../assets/images/logofs.jpg')}
          style={{width: 25, height: 25, marginRight: 10}}></Image>
        <Text style={styles.customText}>Fashion Store</Text>
      </View>

      <Text style={styles.orderDate}>Date: {item.timestamp}</Text>
      {item.items.map((orderItem, index) => (
        <View style={styles.itemListProduct}>
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


export default OrderPackaged;

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

