import {
  Badge,
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextComponent} from '../../components';
import {productRef} from '../../firebase/firebaseConfig';
import {ProductModel, SubProduct} from '../../models/ProductModel';
// import {globalStyles} from '../../styles/globalStyles';
import {Add, Minus} from 'iconsax-react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../utils/useStatusBar';
import ImageSwiper from './components/ImageSwiper';
import RatingComponent from './components/RatingComponent';

import {sizes} from '../../constants/sizes';
import auth from '@react-native-firebase/auth';
const ProductDetail = ({navigation, route}: any) => {
  const {id} = route.params;

  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);
  const [subProductSelected, setSubProductSelected] = useState<SubProduct>();
  const [count, setCount] = useState(1);
  const [sizeSelected, setSizeSelected] = useState('');


  useStatusBar('dark-content');

  useEffect(() => {
    getProductDetail();
   getSubProducts();
  }, [id]);

  useEffect(() => {
    setCount(1);
    setSizeSelected('');
  }, [subProductSelected]);

  const getUserId = () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      return currentUser.uid;
    } else {
      console.log('No user is signed in.');
      return null;
    }
  };
  //onsnap cập nhật ngay lập tức
  const getProductDetail = () => {
    productRef.doc(id).onSnapshot((snap: any) => {
      if (snap.exists) {
        setProductDetail({
          id,
          ...snap.data(),
        });
      } else {
        setProductDetail(undefined);
      }
    });
  };

   const getSubProducts = async () => {
    try {
      const snap = await firestore()
        .collection('subProducts')
        .where('productId', '==', id)
        .get();

      if (snap.empty) {
        setSubProducts([]);
        setSubProductSelected(undefined);
      } else {
        const items: SubProduct[] = [];

        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data(),
          });
        });

        setSubProducts(items);
        setSubProductSelected(items[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (
    userId: string | null | undefined,
    productId: string | number,
    quantity: number,
  ) => {
     if (!sizeSelected) {
      Alert.alert('Bạn chưa chọn size');
      return;
    }
    const cartRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('cart')
      .doc('cartDoc');

    try {
      await firestore().runTransaction(async transaction => {
        const cartDoc = await transaction.get(cartRef);

        if (!cartDoc.exists) {
          // Nếu giỏ hàng chưa tồn tại, tạo mới với sản phẩm đầu tiên
          transaction.set(cartRef, {
            products: {
              [productId]: {
                quantity: quantity,
                addedAt: new Date().toISOString(), // Thêm thời gian thêm vào
              },
            },
          });
        } else {
          // Nếu giỏ hàng đã tồn tại, cập nhật số lượng sản phẩm
          const currentProducts = cartDoc.data().products || {};
          const currentQuantity = currentProducts[productId]?.quantity || 0;

          // Cập nhật số lượng và thời gian thêm vào
          transaction.update(cartRef, {
            [`products.${productId}`]: {
              quantity: currentQuantity + quantity,
              addedAt: new Date().toISOString(), // Cập nhật thời gian thêm vào
            },
          });
        }
      });

      console.log('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart: ', error);
    }
  };

  const renderCartButton = () => {
    return (
      subProductSelected && (
        <Button
          disable={subProductSelected.quantity === 0}
          icon={<FontAwesome6 name="bag-shopping" size={18} color={'white'} />}
          inline
          onPress={() => handleAddToCart(getUserId(), id, count)}
          color={colors.black}
          title={'Add to cart'}
        />
      )
    );
  };

  return (
    <>
      <Section
        styles={{
          zIndex: 5,
          position: 'absolute',
          top: 10,
          right: 0,
          left: 0,
          padding: 20,
          marginTop:15
        }}>
        <Row
          styles={{backgroundColor: 'transparent'}}
          justifyContent="space-between">
          <TouchableOpacity
            style={[
              globalStyles.center,
              {
                backgroundColor: colors.gray800,
                borderRadius: 100,
                padding: 0,
                width: 38,
                height: 38,
              },
            ]}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              style={{marginLeft: 8}}
              name="arrow-back-ios"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
          <Badge>
            <TouchableOpacity
              style={[
                globalStyles.center,
                {
                  backgroundColor: colors.white,
                  borderRadius: 100,
                  padding: 0,
                  width: 38,
                  height: 38,
                },
              ]}
              onPress={() => navigation.navigate('Cart')}>
              <MaterialCommunityIcons
                name="shopping"
                size={22}
                color={colors.gray800}
              />
            </TouchableOpacity>
          </Badge>
        </Row>
      </Section>
      <ScrollView
        style={[
          globalStyles.container,
          {backgroundColor: 'white', flexGrow: 1},
        ]}>
        <View
          style={[
            globalStyles.container,
            {
              
              height: sizes.height * 0.5,
            },
          ]}>
          {subProductSelected && (
            <View
              style={{
                // marginTop:35,
                width: sizes.width,
                height: sizes.height * 0.5,
              }}>
              <ImageSwiper files={subProductSelected.files} />
            </View>
          )}
        </View>
        <View
          style={[
            globalStyles.container,
            {
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              marginTop: -20,
              backgroundColor: 'white',
            },
          ]}>
          {productDetail && subProductSelected && (
            <Section styles={{paddingVertical: 12, backgroundColor:colors.gray100, borderTopStartRadius:30,borderTopEndRadius:30}}>
              <Row>
                <Col>
                  <TextComponent
                    text={productDetail?.title}
                    font={fontFamilies.RobotoBold}
                    size={20}
                   
                  />
                  <TextComponent
                    text={productDetail.type}
                    color={colors.gray}
                    styles={{paddingVertical: 8}}
                  />
                  <RatingComponent id={id} />
                </Col>
                <View>
                  <Row justifyContent="flex-end">
                    <Row
                      styles={{
                        backgroundColor: colors.gray300,
                        padding: 6,
                        borderRadius: 100,
                      }}>
                      <TouchableOpacity
                        style={{paddingLeft: 12}}
                        disabled={count === 1}
                        onPress={() => setCount(count - 1)}>
                        <Minus
                          size={24}
                          color={count === 1 ? colors.gray : colors.black}
                        />
                      </TouchableOpacity>

                      <TextComponent text={count.toString()} size={16} />
                      <TouchableOpacity
                        disabled={subProductSelected.quantity === 0}
                        style={{paddingRight: 12}}
                        onPress={() => setCount(count + 1)}>
                        <Add size={24} color={colors.black} />
                      </TouchableOpacity>
                    </Row>
                  </Row>
                  <Space height={12} />
                  <TextComponent
                    text={`${
                      subProductSelected.quantity > 0
                        ? 'Avaliable'
                        : 'Unavaliable'
                    } in stok`}
                    font={fontFamilies.RobotoMedium}
                  />
                </View>
              </Row>
              <Space height={20} />
              <Row>
                <Col>
                  <View>
                    <TextComponent
                      font={fontFamilies.RobotoBold}
                      text="Size"
                      size={18}
                    />
                    <Space height={16} />
                    <Row wrap="wrap" justifyContent="flex-start">
                      {subProductSelected.size &&
                        subProductSelected.size.length > 0 &&
                        subProductSelected.size.map((itemSize, index) => (
                          <Button
                            key={itemSize}
                            color={
                              itemSize === sizeSelected
                                ? colors.black
                                : undefined
                            }
                            styles={{
                              minWidth: 50,
                              height: 50,
                              paddingHorizontal: 0,
                              marginRight:
                                index < subProductSelected.size.length - 1
                                  ? 12
                                  : 0,
                            }}
                            inline
                            textStyleProps={{
                              fontSize: 14,
                            }}
                            isShadow={false}
                            title={itemSize}
                            onPress={() => setSizeSelected(itemSize)}
                          />
                        ))}
                    </Row>
                  </View>
                </Col>
                <View
                  style={[
                    globalStyles.shadow,
                    {
                      marginHorizontal: 12,
                      padding: 12,
                      borderRadius: 100,
                      backgroundColor: 'white',
                    },
                  ]}>
                  {subProducts.length > 0 &&
                    subProducts.map(item => (
                      <TouchableOpacity
                        onPress={() => setSubProductSelected(item)}
                        key={item.id}
                        style={[
                          globalStyles.center,
                          {
                            width: 24,
                            height: 24,
                            borderRadius: 100,
                            backgroundColor: item.color,
                            marginVertical: 4,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                          },
                        ]}>
                        {item.color === subProductSelected.color && (
                          <MaterialCommunityIcons
                            name="check"
                            size={18}
                            color={colors.red700}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                </View>
              </Row>
              <Space height={20} />
              <TextComponent
                font={fontFamilies.RobotoBold}
                text="Description"
                size={18}
              />
              <Space height={8} />
              <TextComponent
                text={productDetail.description}
                styles={{textAlign: 'justify'}}
                size={12}
                color={colors.gray700}
              />
            </Section>
          )}
        </View>
      </ScrollView>
      <Section styles={{backgroundColor: 'white', paddingTop: 12}}>
        <Row>
          <Col>
            {subProductSelected && count && (
              <>
                <TextComponent
                  text="Total price:"
                  size={12}
                  color={colors.gray}
                />
                <TextComponent
                  text={`$${count * parseFloat(subProductSelected.price)}`}
                  size={24}
                  font={fontFamilies.poppinsBold}
                />
              </>
            )}
          </Col>
          <Col>{renderCartButton()}</Col>
        </Row>
      </Section>
    </>
  );
};

export default ProductDetail;
