import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Add, Minus} from 'iconsax-react-native';
import Dialog from 'react-native-dialog';
import {db, orderRef} from '../../firebase/firebaseConfig';
import {doc, firebase, getDoc, updateDoc} from '@react-native-firebase/firestore';
import {PaymentMethodModel} from '../../models/OrderModel';
import auth, {getAuth} from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import firestore from '@react-native-firebase/firestore';
import NotificationService from '../../utils/notificationService';
import OrderNotificationService from '../../utils/orderNotificationService';
import MessageNotificationService from '../../utils/messageNotificationService';
import notifee from '@notifee/react-native';
import HomeScreen from '../home/HomeScreen';
const sendNotification = async (title, body) => {
  // Đảm bảo kênh thông báo tồn tại trước khi gửi thông báo
  const channelId = await notifee.createChannel({
    id: 'message_channel',
    name: 'Message Channel',
    sound: 'default',
  });

  // Hiển thị thông báo
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // Đảm bảo rằng bạn đã thêm ic_launcher vào tài nguyên Android
    },
  });
};

const CheckOutScreen = ({route}: any) => {
  const navigation = useNavigation();
  const {selectedItems} = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [items, setItems] = useState(route.params.selectedItems);
  const [totalPrice, setTotalPrice] = useState(0);
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState('');
  const timerRef = useRef(null); // Create a ref to store the timer ID

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

  //lay status id
  function getOrderStatusById(orderStatusId: string): string {
    switch (orderStatusId) {
      case '0':
        return 'Hủy đơn';
      case '1':
        return 'Đang xử lý đơn hàng mới';
      case '2':
        return 'Đang chuẩn bị';
      case '2':
        return 'Đã đóng gói';
      case '4':
        return 'Chờ vận chuyển';
      case '5':
        return 'Đang vận chuyển';
      case '6':
        return 'Đã giao hàng';
      case '7':
        return 'Giao thất bại';
      case '8':
        return 'Trả kho';
      case '9':
        return 'Trả tiền';
      case '10':
        return 'Đã nhận lại hàng';
      case '11':
        return 'Hoàn thành';
      default:
        return 'Trạng thái không xác định';
    }
  }
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current); 
    };
  }, []);

  const showDialogAndAddOrders = async () => {
    try {
      if (!selectedPaymentMethod) {
        console.error('Chưa chọn phương thức thanh toán.');
        return;
      }

      if (!items || items.length === 0) {
        console.error('Không có sản phẩm trong giỏ hàng.');
        return;
      }

      if (!user.phoneNumber) {
        Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại', [
          {text: 'OK', onPress: () => navigation.navigate('Address')},
        ]);
        return;
      }

      if (!user.fullAddress) {
        Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ', [
          {text: 'OK', onPress: () => navigation.navigate('Address')},
        ]);
        return;
      }

      if (totalPrice <= 0) {
        console.error('Tổng giá trị đơn hàng phải lớn hơn 0.');
        return;
      }
    

      const sanitizedItems = items.map(item => ({...item}));
      const orderData = {
        userId: auth().currentUser?.uid, // UID người dùng
        address: user.fullAddress,
        items: sanitizedItems,
        totalPrice: totalPrice,
        shipperId: null,
        paymentMethodId: selectedPaymentMethod,
        orderStatusId: '1', // Trạng thái đơn hàng ban đầu là "Đã đặt"
        timestamp: getCurrentDateTime(),
      };

      const docRef = await firestore().collection('orders').add(orderData);
      const orderId = docRef.id; // Lấy ID của đơn hàng vừa thêm

      const orderStatus = getOrderStatusById(orderData.orderStatusId);

      await NotificationService.saveNotificationToFirestore(
        orderId,
        orderStatus,
      );

      // Gửi thông báo đến người dùng
      if (auth().currentUser?.uid && orderId) {
        try {
          //@ts-ignore
          const userId = auth().currentUser.uid;

          // Gửi thông báo
          await MessageNotificationService.setupMessageNotificationListener(
            //@ts-ignore
            userId,
            {
              title: 'Đơn hàng mới',
              body: `Bạn đã đặt thành công.(#${orderId}) `,
            },
            {orderId, status: orderStatus},
          );

          setTimeout(() => {
            MessageNotificationService.removeMessageNotificationListener();
            console.log(`Đã gỡ bỏ listener cho đơn hàng ${orderId}`);
          }, 1000); // Gỡ bỏ listener sau 5 giây

          await sendNotification(
            'Đơn hàng mới',
            `Bạn đã đặt thành công.(#${orderId})`,
          );

          console.log(
            `Thông báo đơn hàng ${orderId} đã được gửi thành công cho người dùng ${userId}`,
          );
        } catch (error) {
          console.error('Lỗi khi gửi thông báo cho người dùng:', error);
        }
      } else {
        console.error('Không có UID người dùng hoặc ID đơn hàng không hợp lệ.');
      }

      await removeItemsFromCart(items);

      await orderRef.add(orderData);

      // Trừ số lượng sản phẩm theo size
      for (const item of sanitizedItems) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists) {
          const productData = productSnap.data();
          const updatedVariations = productData.variations.map(variation => {
            if (variation.color === item.colorSelected) {
              return {
                ...variation,
                sizes: variation.sizes.map(size => {
                  if (size.sizeId === item.sizeSelected) {
                    return {
                      ...size,
                      quantity: Math.max(size.quantity - item.quantity, 0), // Đảm bảo không âm
                    };
                  }
                  return size;
                }),
              };
            }
            return variation;
          });

          // Cập nhật lại sản phẩm
          await updateDoc(productRef, {variations: updatedVariations});
        }
      }

      // Xóa sản phẩm khỏi giỏ hàng
      await removeItemsFromCart(items);

      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        navigation.replace('CartScreen');
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi xử lý đơn hàng:', error);
    }
  };

  const removeItemsFromCart = async (items: any[]) => {
    const userId = getAuth().currentUser?.uid;
    const cartRef = firebase.firestore().collection('carts').doc(userId);

    try {
      const cartDoc = await cartRef.get();
      if (cartDoc.exists) {
        const cartData = cartDoc.data();
        const cartProducts = cartData?.products || {};

        const updatedProducts = {...cartProducts};

        items.forEach(item => {
          const productKey = `${item.productId}-${item.colorSelected}-${item.sizeSelected}`;

          delete updatedProducts[productKey];
        });

        // Cập nhật lại giỏ hàng trong Firestore
        await cartRef.update({products: updatedProducts});
        console.log('Đã xóa sản phẩm khỏi giỏ hàng thành công.');

        // Optionally, bạn có thể refetch lại dữ liệu giỏ hàng để cập nhật giao diện
      } else {
        console.error('Không tìm thấy giỏ hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng: ', error);
    }
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

  const renderItemPaymentMethod = ({item}) => (
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
                  {user.ward + ','} {user.district + ','} {user.province + ','}{' '}
                  {user.country}
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
          {selectedItems && selectedItems.length > 0 ? (
            selectedItems.map(item => (
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
                    {item.color} - {item.size} - SL: {item.quantity}
                  </Text>
                  <Text style={styles.customText}>Price: {`$${item.price}`}</Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.customText}>
                      Total: {`$${item.price * item.quantity}`}
                    </Text>
                    {/* <View
                      style={[
                        styles.flexDirection,
                        {
                          backgroundColor: '#e0e0e0',
                          
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
                    </View> */}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No items selected for checkout
            </Text>
          )}
        </ScrollView>

        <View style={{marginVertical: 10}}>
          <Text style={[{color: 'black', fontSize: 27}]}>Payment method</Text>
          {/* <FlatList
            data={paymentMethods}
            renderItem={renderItemPaymentMethod}
            keyExtractor={item => item.paymentMethodId}></FlatList> */}
          <FlatList
            data={paymentMethods}
            renderItem={renderItemPaymentMethod}
            keyExtractor={item => item.paymentMethodId}
          />
        </View>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 22, color: 'black'}}>Total</Text>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              {`$${totalPrice.toLocaleString()}`}
            </Text>
          </View>
          {/* nút mua */}
          <TouchableOpacity
            style={[
              styles.touchCheckOut,
              {backgroundColor: selectedPaymentMethod ? '#FA7189' : '#A9A9A9'},
            ]}
            onPress={showDialogAndAddOrders}
            disabled={!selectedPaymentMethod}>
            <Text style={styles.textCheckOut}>Mua</Text>
          </TouchableOpacity>
          {/*  nút mua  */}
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
