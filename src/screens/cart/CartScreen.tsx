import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  CartItem,
  cartSelector,
  updateQuantity,
} from '../../redux/reducers/cartReducer';
import { Col, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {Minus, Add} from 'iconsax-react-native';


const CartScreen = () => {
  const navigation = useNavigation();
  const cartData: CartItem[] = useSelector(cartSelector);
  const dispatch = useDispatch();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Hàm để chọn hoặc bỏ chọn sản phẩm
  const toggleSelectProduct = (item: CartItem) => {
    if (selectedProducts.includes(item.id)) {
      setSelectedProducts(selectedProducts.filter(id => id !== item.id));
    } else {
      setSelectedProducts([...selectedProducts, item.id]);
    }
  };

  // Hàm để chọn hoặc bỏ chọn tất cả sản phẩm
  const handleChooseAll = () => {
    if (isSelectAll) {
      // Nếu đang chọn tất cả -> bỏ chọn tất cả
      setSelectedProducts([]);
      setIsSelectAll(false);
    } else {
      // Nếu chưa chọn tất cả -> chọn tất cả
      setSelectedProducts(cartData.map(item => item.id));
      setIsSelectAll(true);
    }
  };
  const handleCheckOut = () => {
    navigation.navigate('CheckOut');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCart}>Carts({cartData.length})</Text>
      {cartData.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            {/* Listcart */}
            <FlatList
              style={{marginHorizontal: 10, marginBottom: 10}}
              data={cartData}
              renderItem={({item, index}) => (
                <View key={item.id} style={styles.itemListProduct}>
                  <Row alignItems="center" styles={{margin: 10}}>
                    <Col flex={0.15}>
                      <TouchableOpacity
                        onPress={() => toggleSelectProduct(item)}>
                        <View style={styles.radioCircle}>
                          {selectedProducts.includes(item.id) && (
                            <View style={styles.selectedRb} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </Col>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 12,
                        resizeMode: 'cover',
                      }}></Image>
                    <Space width={12}></Space>
                    <Col>
                      <TextComponent
                        type="title"
                        text={item.title}
                        size={20}></TextComponent>
                      <TextComponent text={item.description}></TextComponent>
                      <Row flex={1} alignItems="flex-end">
                        <Col>
                          <TextComponent
                            type="title"
                            text={`$${item.price * item.quantity}`}
                            size={20}></TextComponent>
                        </Col>
                        <Row
                          styles={{
                            backgroundColor: '#e0e0e0',
                            paddingVertical: 4,
                            borderRadius: 100,
                            paddingHorizontal: 12,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: -1,
                                }),
                              )
                            }>
                            <Minus size={20} color="black"></Minus>
                          </TouchableOpacity>
                          <Space width={6}></Space>
                          <TextComponent
                            text={`${item.quantity}`}></TextComponent>
                          <Space width={6}></Space>
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: 1,
                                }),
                              )
                            }>
                            <Add size={20} color="black"></Add>
                          </TouchableOpacity>
                        </Row>
                      </Row>
                    </Col>
                  </Row>
                </View>
              )}></FlatList>
          </View>

          <View style={styles.flexDirectionChooseAll}>
            <TouchableOpacity onPress={handleChooseAll}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* Radio check cho nút chọn tất cả */}
                <TouchableOpacity onPress={handleChooseAll}>
                  <View style={[styles.radioCircle, {borderColor: 'gray'}]}>
                    {isSelectAll && <View style={styles.selectedRb} />}
                  </View>
                </TouchableOpacity>
                <Text style={{marginLeft: 10, fontSize: 22, color: 'black'}}>
                  {isSelectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              {isSelectAll === true
                ? `$${cartData
                    .reduce((a, b) => a + b.quantity * b.price, 0)
                    .toLocaleString()}`
                : '0'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.touchCheckOut}
            onPress={handleCheckOut}>
            <Text style={styles.textCheckOut}>Check Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Section>
          <TextComponent text="No product in your cart"></TextComponent>
        </Section>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textCart: {
    marginTop: 35,
    paddingBottom: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  touchCheckOut: {
    backgroundColor: '#FA7189',
    borderRadius: 10,
    margin: 10,
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
  flexDirectionChooseAll: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemListProduct: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
  },
});
