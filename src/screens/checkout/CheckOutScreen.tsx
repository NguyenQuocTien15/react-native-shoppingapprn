import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Add, Minus} from 'iconsax-react-native';
import Dialog from 'react-native-dialog';
import {Button} from '@bsdaoquang/rncomponent';
import {
  orderRef,
} from '../../firebase/firebaseConfig';
import {
  firebase,
} from '@react-native-firebase/firestore';
import EvilIcons from 'react-native-vector-icons//EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  PaymentMethodModel,
} from '../../models/OrderModel';
import { useDispatch } from 'react-redux';
import { removeCartItem } from '../../redux/reducers/cartReducer';
import auth from '@react-native-firebase/auth';
const CheckOutScreen = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [items, setItems] = useState(route.params.selectedItems);
  const [totalPrice, setTotalPrice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState('');

  const [userId, setUserId] = useState(null);

    const getUserId = () => {
      const currentUser = auth().currentUser;

      if (currentUser) {
        return currentUser.uid;
      } else {
        console.log('No user is signed in.');
        return null;
      }
    };

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUser();
      setUser(data);
    };
    loadUser();
  }, []);

  const fetchUser = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        const user = doc.data();
        return user;
      } else {
        console.log('No user data found!');
      }
    }
  };
  function getCurrentDateTime(): string {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const showDialogAndAddOrders = async () => {
    try {
      const orderData = {
        userId: getUserId(),
        address: `${user.houseNumber}, ${user.selectedWard}, ${user.selectedDistrict}, ${user.selectedProvince}, Việt Nam`,
        items: items,
        totalPrice: totalPrice,
        shipperId: null,
        paymentMethodId: selectedPaymentMethod,
        orderStatusId: '1',
        timestamp: getCurrentDateTime(),
      };

      await orderRef.add(orderData);
      dispatch(removeCartItem(items.map((item: { id: any; }) => item.id)));
      setVisible(true);
    } catch (error) {
      console.error('Error saving order: ', error);
    }
  };

  const handleNavigationMyOrder = () => {
    navigation.navigate('MyOrder');
    setVisible(false);
  };

  const calculateTotalPrice = () => {
    const total = items.reduce(
      (sum: number, item: {price: number; quantity: number}) =>
        sum + item.price * item.quantity,
      0,
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  const handleIncreaseQuantity = (id: any) => {
    const updatedItems = items.map((item: {id: any; quantity: number}) => {
      if (item.id === id) {
        return {...item, quantity: item.quantity + 1};
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleDecreaseQuantity = (id: any) => {
    const updatedItems = items.map((item: {id: any; quantity: number}) => {
      if (item.id === id && item.quantity > 1) {
        return {...item, quantity: item.quantity - 1};
      }
      return item;
    });
    setItems(updatedItems);
  };
  const paymentMethods: PaymentMethodModel[] = [
    {paymentMethodId: '0', paymentMethodName: 'Thanh toán khi nhận hàng'},
  ];
  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId);
  };
  const renderItemPaymentMethod = ({item}: {item: PaymentMethodModel}) => (
    <View style={[styles.flexDirection, {alignItems: 'center'}]}>
      <Text style={{color: 'black', fontSize: 20}}>
        {item.paymentMethodName}
      </Text>
      <View>
        <TouchableOpacity
          onPress={() => handlePaymentMethodSelect(item.paymentMethodId)}>
          <View style={[styles.radioCircle, {borderColor: 'gray'}]}>
            {selectedPaymentMethod === item.paymentMethodId && (
              <View style={styles.selectedRb} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Address')}>
        <View style={{marginBottom: 10}}>
          {user ? (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <EvilIcons name="location" size={20} color="black" />
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Text style={styles.customText}>{user.displayName}</Text>
                  <Text style={[styles.customText, {marginLeft: 7}]}>
                    {user.phoneNumber}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              <View style={{marginLeft: 20, flexDirection: 'column'}}>
                <Text style={{color: 'black', fontSize: 13}}>
                  {user.houseNumber}
                </Text>
                <Text style={{color: 'black', fontSize: 13}}>
                  {user.selectedWard}
                  {', '}
                  {user.selectedDistrict}
                  {', '}
                  {user.selectedProvince}
                </Text>
              </View>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
          <View style={styles.lineRed} />
        </View>
      </TouchableOpacity>

      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          {items.map(item => (
            <View
              key={item.id}
              style={[
                styles.itemListProduct,
                {flexDirection: 'row', padding: 10},
              ]}>
              <Image
                source={{uri: item.imageUrl}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  marginRight: 10,
                }}></Image>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text
                  style={styles.customText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.title}
                </Text>
                <Text
                  style={{color: 'black', fontSize: 18}}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.description}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.customText}>{`$${
                    item.price * item.quantity
                  }`}</Text>
                  <View
                    style={[
                      styles.flexDirection,
                      {
                        backgroundColor: '#e0e0e0',
                        paddingVertical: 4,
                        borderRadius: 100,
                        paddingHorizontal: 12,
                        alignItems: 'center',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => handleDecreaseQuantity(item.id)}>
                      <Minus size={20} color="black"></Minus>
                    </TouchableOpacity>

                    <Text
                      style={{
                        marginLeft: 12,
                        marginRight: 12,
                        fontSize: 18,
                        color: 'black',
                      }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleIncreaseQuantity(item.id)}>
                      <Add size={20} color="black"></Add>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{marginVertical: 10}}>
          <Text style={[{color: 'black', fontSize: 27}]}>Payment method</Text>
          <FlatList
            data={paymentMethods}
            renderItem={renderItemPaymentMethod}
            keyExtractor={item => item.paymentMethodId}></FlatList>
        </View>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 22, color: 'black'}}>Total</Text>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              {`$${totalPrice.toLocaleString()}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.touchCheckOut,
              {backgroundColor: selectedPaymentMethod ? '#FA7189' : '#A9A9A9'},
            ]}
            onPress={showDialogAndAddOrders}
            disabled={!selectedPaymentMethod}>
            <Text style={styles.textCheckOut}>Order</Text>
          </TouchableOpacity>
          <Dialog.Container contentStyle={{borderRadius: 15}} visible={visible}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../assets/images/checksuccess.png')}
                style={{width: 50, height: 50, marginTop: 20, marginBottom: 20}}
              />
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 30,
                  color: 'black',
                }}>
                Order Successfully!
              </Text>
            </View>
            <Button
              title="My Orders"
              onPress={handleNavigationMyOrder}
              color="#ff7891"></Button>
          </Dialog.Container>
        </View>
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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
  touchCheckOut: {
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
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7891',
    borderColor: '#ff7891',
  },
  itemListProduct: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    borderRadius: 5,
  },
  lineRed: {
    width: '100%',
    height: 1,
    backgroundColor: 'red',
    marginTop: 10,
  },
});
