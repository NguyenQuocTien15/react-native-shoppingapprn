import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CartItem, cartSelector, updateQuantity} from '../../redux/reducers/cartReducer';
import {Card, Col, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../constants/colors';
import { Minus, Add } from 'iconsax-react-native';
import Icon from '@react-native-vector-icons/ionicons';



const CartScreen = () => {
  const navigation = useNavigation();
  const cartData: CartItem[] = useSelector(cartSelector);
  const dispatch = useDispatch();
  
  const handleChooseAll = () => {};
  const handleCheckOut = () => {
    navigation.navigate('MyOrder');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.textCart}>Carts({cartData.length})</Text>
      {cartData.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            {/* Listcart */}
            <FlatList
              style={{marginHorizontal: 16, marginBottom: 10}}
              data={cartData}
              renderItem={({item, index}) => (
                <View key={item.id} style={styles.itemListProduct}>
                  <Row alignItems="flex-start" styles={{margin: 10}}>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        resizeMode: 'cover',
                      }}></Image>
                    <Space width={12}></Space>
                    <Col>
                      <TextComponent
                        type="title"
                        text={item.title}
                        size={20}></TextComponent>
                      <TextComponent text={item.size}></TextComponent>
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
                          onPress={()=> dispatch(updateQuantity({
                            id: item.id,
                            quantity: -1
                          }))}>
                            <Minus size={20} color="black"></Minus>
                          </TouchableOpacity>
                          <Space width={6}></Space>
                          <TextComponent
                            text={`${item.quantity}`}></TextComponent>
                          <Space width={6}></Space>
                          <TouchableOpacity onPress={()=> dispatch(updateQuantity({
                            id: item.id,
                            quantity: 1
                          }))}>
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
            <TouchableOpacity onPress={() => handleChooseAll}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.radioButton}></View>
                <Text style={{marginLeft: 10, fontSize: 22, color: 'black'}}>
                  Chọn tất cả
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              {`$${cartData
                .reduce((a, b) => a + b.quantity * b.price, 0)
                .toLocaleString()}`}
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
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
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
