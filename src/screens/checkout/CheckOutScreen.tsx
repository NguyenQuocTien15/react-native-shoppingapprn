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
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Add, Minus} from 'iconsax-react-native';

const CheckOutScreen = ({route}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState(route.params.selectedItems); // Dùng state để theo dõi sản phẩm
  const [totalPrice, setTotalPrice] = useState(0); // State để lưu tổng giá trị

  // Hàm tính tổng giá trị tất cả sản phẩm
  const calculateTotalPrice = () => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotalPrice(total); // Cập nhật totalPrice khi tính toán xong
  };

  // Gọi tính toán tổng tiền khi items thay đổi
  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  // Hàm xử lý tăng số lượng sản phẩm
  const handleIncreaseQuantity = (id: any) => {
    const updatedItems = items.map((item: { id: any; quantity: number; }) => {
      if (item.id === id) {
        return {...item, quantity: item.quantity + 1};
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Hàm xử lý giảm số lượng sản phẩm
  const handleDecreaseQuantity = (id: any) => {
    const updatedItems = items.map((item: { id: any; quantity: number; }) => {
      if (item.id === id && item.quantity > 1) {
        return {...item, quantity: item.quantity - 1};
      }
      return item;
    });
    setItems(updatedItems);
  };
  const handlePaymentMethod = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.flexDirection, {marginBottom: 10}]}>
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
                <Text style={styles.customText}>{item.title}</Text>
                <Text style={{color: 'black', fontSize: 18}}>
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
          <View style={[styles.flexDirection, {alignItems: 'center'}]}>
            <Text style={{color: 'black', fontSize: 20}}>
              Thanh toán khi nhận hàng
            </Text>
            <View>
              <TouchableOpacity onPress={handlePaymentMethod}>
                <View style={[styles.radioCircle, {borderColor: 'gray'}]}>
                  {checked && <View style={styles.selectedRb} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
              {backgroundColor: checked ? '#FA7189' : '#A9A9A9'},
            ]}
            onPress={() => navigation.navigate('MyOrder')}
            disabled={!checked}>
            <Text style={styles.textCheckOut}>Order</Text>
          </TouchableOpacity>
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
});
