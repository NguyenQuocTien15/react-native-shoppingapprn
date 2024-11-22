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
import {TouchableOpacity} from 'react-native';
import {orderRef} from '../../firebase/firebaseConfig';
import Dialog from 'react-native-dialog';
import auth from '@react-native-firebase/auth';
import {deleteDoc, doc, firebase, getDoc, setDoc} from '@react-native-firebase/firestore';

const OrderWaitingForConfirmationScreen = () => {
  const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

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
      .where('orderStatusId', '==', '1') 
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

    // Cleanup listener on component unmount or userId change
    return () => unsubscribe();
  }, [userId]);

  // const showDialog = (
  //   orderId: React.SetStateAction<null>,
  //   productIndex: React.SetStateAction<null>,
  // ) => {
  //   setSelectedOrder(orderId);
  //   setSelectedProductIndex(productIndex);
  //   setDialogVisible(true);
  // };
  const showDialog = (orderId: React.SetStateAction<null>) => {
    setSelectedOrder(orderId);
    setDialogVisible(true);
  };

  const handleCancelDialog = () => {
    setDialogVisible(false);
  };

  const handleCancelOrderProduct = async () => {
    if (selectedOrder === null || selectedProductIndex === null) return;

    try {
      const orderToUpdate = orders.find(order => order.id === selectedOrder);
      if (!orderToUpdate) return;

      // Remove the product from the local state
      const updatedItems = [...orderToUpdate.items];
      updatedItems.splice(selectedProductIndex, 1);

      const orderDocRef = orderRef.doc(selectedOrder);

      if (updatedItems.length === 0) {
        // Delete the entire order if no items remain
        await orderDocRef.delete();
        setOrders(prevOrders =>
          prevOrders.filter(order => order.id !== selectedOrder),
        );
      } else {
        // Update the order in Firebase
        await orderDocRef.update({items: updatedItems});
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === selectedOrder
              ? {...order, items: updatedItems}
              : order,
          ),
        );
      }
      setDialogVisible(false);
    } catch (error) {
      console.error('Error deleting product or order from Firebase: ', error);
    }
  };
  // const handleCancelOrder = async() => {
  //   try {
  //     if (!selectedOrder) return;
  //     const orderRef = doc(firebase.firestore(), 'orders', selectedOrder);
  //     await deleteDoc(orderRef);
      
  //     setDialogVisible(false);
  //   } catch (error) {
  //     console.error('Lỗi khi xóa đơn hàng:', error);
  //   }
  // };
  const handleCancelOrder = async () => {
    try {
      if (!selectedOrder) return;

      const orderRef = doc(firebase.firestore(), 'orders', selectedOrder);
      const orderSnapshot = await getDoc(orderRef);

      if (orderSnapshot.exists) {
        // Retrieve order data
        const orderData = orderSnapshot.data();

        // Add canceled order to `orderHistory`
        const userId = orderData.userId; // assuming userId is stored in the order data
        const orderHistoryRef = doc(
          firebase.firestore(),
          'orderHistory',
          userId,
          'userOrders',
          selectedOrder,
        );

        await setDoc(orderHistoryRef, {
          ...orderData,
          orderStatusId: '0', 
          cancellationTimestamp:
            firebase.firestore.FieldValue.serverTimestamp(),
        });
        await setDoc(orderRef, {
          ...orderData,
          orderStatusId: '0',
        });

        // // Delete the order from `orders`
        // await deleteDoc(orderRef);
        // console.log('Order canceled and moved to orderHistory.');
      } else {
        console.log('Order not found.');
      }

      setDialogVisible(false);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };


  const renderItem = ({item}) => (
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
          <View key={item.id} style={styles.orderProduct}>
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
                {orderItem.color} - {orderItem.size} - SL:
                {orderItem.quantity}
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                <Text style={styles.customText}>Price: ${orderItem.price}</Text>
                <View
                  style={[
                    styles.flexDirection,
                    {
                      paddingVertical: 4,
                      borderRadius: 100,
                      alignItems: 'center',
                    },
                  ]}>
                  {/* <TouchableOpacity
                    style={[
                      styles.touch,
                      {
                        backgroundColor: 'white',
                      },
                    ]}
                    onPress={() => showDialog(item.id, index)}>
                    <Text
                      style={[
                        styles.textTouch,
                        {
                          color: 'black',
                        },
                      ]}>
                      Cancel
                    </Text>
                  </TouchableOpacity> */}
                </View>
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
          onPress={() => showDialog(item.id)}>
          <Text
            style={[
              styles.textTouch,
              {
                color: 'black',
              },
            ]}>
            Hủy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex:1, justifyContent:'center'}}>
          <ActivityIndicator color="blue" size="small"></ActivityIndicator>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Dialog for cancellation */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Cancel Order</Dialog.Title>
        <Dialog.Description>Do you want to cancel order?</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancelDialog} />
        <Dialog.Button label="Yes" onPress={handleCancelOrder} />
      </Dialog.Container>
    </View>
  );
};

export default OrderWaitingForConfirmationScreen;

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
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    paddingBottom:10,
    shadowColor: '#000',          // Shadow color
    shadowOffset: { width: 0, height:  2}, // Shadow offset
    shadowOpacity: 1,          // Shadow opacity
    shadowRadius: 5,           // Shadow radius
    elevation: 5,                 // Elevation for Android
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
