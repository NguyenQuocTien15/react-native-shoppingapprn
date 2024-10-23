import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {orderRef} from '../../firebase/firebaseConfig';

const OrderWaitingForConfirmationScreen = () => {
  const handleCancel = () => {};
  const handleConfirm = () => {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await orderRef.get();
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
      <Text style={styles.orderTotal}>
        Total: ${item.totalPrice.toLocaleString()}
      </Text>
      <Text style={styles.orderAddress}>Address: {item.address}</Text>
      <Text style={styles.orderDate}>
        Date: {new Date(item.timestamp).toLocaleString()}
      </Text>
      {item.items.map((orderItem, index) => (
        <View style={styles.itemListProduct}>
          <View key={index} style={styles.orderProduct}>
            <Image
              source={{uri: orderItem.imageUrl}}
              style={styles.productImage}
            />
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={styles.customText}>{orderItem.title}</Text>
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
                <Text style={styles.customText}>Price: ${orderItem.price * orderItem.quantity}</Text>
                <View
                  style={[
                    styles.flexDirection,
                    {
                      paddingVertical: 4,
                      borderRadius: 100,
                      alignItems: 'center',
                    },
                  ]}>
                  <TouchableOpacity
                    style={[
                      styles.touch,
                      {
                        backgroundColor: 'white',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.textTouch,
                        {
                          color: 'black',
                        },
                      ]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.touch,
                      {backgroundColor: '#ff7891', marginLeft: 10},
                    ]}>
                    <Text
                      style={[
                        styles.textTouch,
                        {
                          color: 'white',
                        },
                      ]}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
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

export default OrderWaitingForConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  },

  //
  orderItem: {
    marginBottom: 15,
    borderRadius: 10,
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
    borderRadius:10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
});
