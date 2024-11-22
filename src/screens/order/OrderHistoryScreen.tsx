
import {View, Text, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {orderHistoryRef} from '../../firebase/firebaseConfig'; // Import your orderHistory reference
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    setLoading(true);

    if (!userId) return;

    // Query the orderHistory collection for the userId
    const unsubscribe = orderHistoryRef
      .doc(userId) // user-specific collection
      .collection('userOrders') // Orders collection inside user document
      .where('orderStatusId', 'in', ['0', '6', '7']) // Fetch only canceled, delivered, or failed orders
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
  const orderStatusMap = {
    '0': 'Hủy đơn', // Canceled
    '1': 'Đơn hàng mới', // New Order
    '2': 'Đang chuẩn bị', // Preparing
    '3': 'Đã đóng gói', // Packed
    '4': 'Chờ vận chuyển', // Awaiting Shipment
    '5': 'Đang vận chuyển', // In Transit
    '6': 'Đơn hàng đã giao hàng', // Delivered
    '7': 'Giao thất bại', // Failed Delivery
    '8': 'Trả kho', // Returned to Warehouse
  };

  const renderItem = ({item}: any) => {
    const orderStatusName =
      orderStatusMap[item.orderStatusId] || 'Unknown Status';

    return (
      <View style={styles.itemListProduct}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Image
              source={require('../../assets/images/logofs.jpg')}
              style={{width: 25, height: 25, marginRight: 10}}
            />
            <Text style={styles.customText}>Fashion Store</Text>
          </View>
          <View style={{alignItems: 'center', marginTop: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>
              {orderStatusName}
            </Text>
          </View>
        </View>

        <Text style={styles.orderDate}>Date: {item.timestamp}</Text>

        {item.items.map((orderItem, index) => (
          <View key={index}>
            <View style={styles.orderProduct}>
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
                  {orderItem.color} - {orderItem.size} - SL:{' '}
                  {orderItem.quantity}
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
                </View>
              </View>
            </View>
            {item.orderStatusId == '6' ? (
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() =>
                    navigation.navigate('OrderReviewsScreen', {
                      productId: orderItem.productId,
                      title: orderItem.title,
                      imageUrl: orderItem.imageUrl,
                      size: orderItem.size,
                      color: orderItem.color,
                    })
                  }>
                  <Text style={[styles.textTouch, {color: 'white'}]}>
                    Viết đánh giá
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              ''
            )}
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

        {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={[
              styles.touch,
              {
                backgroundColor: 'white',
                width: '30%',
                marginRight: 7,
              },
            ]}
            onPress={() => Alert.alert('Returned')}>
            <Text
              style={[
                styles.textTouch,
                {
                  color: 'black',
                },
              ]}>
              Trả hàng
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="blue" size="small" />
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
    backgroundColor: '#ff7896',
  },
  textTouch: {
    fontSize: 20,
    paddingRight: 5,
    paddingLeft: 5,
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
