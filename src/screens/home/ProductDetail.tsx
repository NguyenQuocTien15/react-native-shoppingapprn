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
import firestore, {
  collection,
  getDocs,
  onSnapshot,
} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextComponent} from '../../components';
import {db, productRef} from '../../firebase/firebaseConfig';
import {ProductModel, SubProduct} from '../../models/ProductModel';
// import {globalStyles} from '../../styles/globalStyles';
import {Add, Minus} from 'iconsax-react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../utils/useStatusBar';
import ImageSwiper from './components/ImageSwiper';
import RatingComponent from './components/RatingComponent';
import Dialog from 'react-native-dialog';
import {sizes} from '../../constants/sizes';
import auth, {firebase, getAuth} from '@react-native-firebase/auth';
import {Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

const ProductDetail = ({navigation, route}: any) => {
  const {id} = route.params;
  const [productDetail, setProductDetail] = useState<
    ProductModel | undefined
  >();
  const [count, setCount] = useState(1);
  const [colorSelected, setColorSelected] = useState('');
  const [sizeSelected, setSizeSelected] = useState('');
  const [visible, setVisible] = useState(false);

  const [sizes, setSizes] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const userId = getAuth().currentUser?.uid;
  useEffect(() => {
    if (productDetail?.variations?.length > 0) {
      const firstColor = productDetail.variations[0].color;
      setColorSelected(firstColor);

      // Set default size to the first size of the first color
      const firstSize = productDetail.variations.find(
        (v: {color: string}) => v.color === firstColor,
      )?.sizes[0]?.size;
      setSizeSelected(firstSize || '');
    }
  }, [productDetail]);

  useEffect(() => {
    setLoading(true)
    const unsubscribe = firestore()
      .collection('products')
      .doc(id)
      .onSnapshot(doc => {
        if (doc.exists) {
          const productData = doc.data();
          setProductDetail(productData);

          if (
            productData &&
            productData.variations &&
            productData.variations.length > 0 &&
            colorSelected
          ) {
            const defaultColorId = productData.variations[0].color;
            setColorSelected(defaultColorId);

            updateAvailableQuantity(colorSelected, productData.variations);
          }
        }
        setLoading(false)
      });
      setLoading(false)

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('sizes')
      .onSnapshot((snapShot: {docs: any[]}) => {
        const sizeItem = snapShot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSizes(sizeItem);
      });
    return () => unsubscribe();
  }, []);

  const handleColorChange = (colorId: string) => {
    setColorSelected(colorId);
    setSizeSelected('');
    console.log('Color selected:', colorId); // Log color
    const firstSize = productDetail.variations.find(
      (v: {color: string}) => v.color === colorId,
    )?.sizes[0]?.size;
    setSizeSelected(firstSize || '');
    if (productDetail) {
      updateAvailableQuantity(colorId, productDetail.variations);
    }
  };

  const handleSizeChange = (size: string) => {
    setSizeSelected(size);
    console.log('Size selected:', size); // Log size

    if (productDetail) {
      // Cập nhật số lượng có sẵn theo size và color đã chọn
      updateAvailableQuantity(colorSelected, productDetail.variations);
    }
  };
  const updateAvailableQuantity = (selectedColor: string, variations: any) => {
    const colorVariation = variations.find(
      (v: any) => v.color === selectedColor,
    );

    if (colorVariation) {
      // Tìm kích cỡ đã chọn trong biến thể của màu sắc đã chọn
      const sizeVariation = colorVariation.sizes.find(
        (s: any) => s.size === sizeSelected,
      );
    }
  };

  const handleAddToCart = async (
    userId: string | null | undefined,
    productId: string | number,
    colorSelected: string,
    sizeSelected: string,
    quantity: number,
  ) => {
    if (!sizeSelected) {
      Alert.alert('Bạn chưa chọn size');
      return;
    }
    if (!colorSelected) {
      Alert.alert('Bạn chưa chọn màu');
      return;
    }

    const cartRef = firestore().collection('carts').doc(userId);

    try {
      await firestore().runTransaction(async transaction => {
        const cartDoc = await transaction.get(cartRef);

        if (!cartDoc.exists) {
          // If cart doesn't exist, create it with the new product
          transaction.set(cartRef, {
            products: {
              [`${productId}-${colorSelected}-${sizeSelected}`]: {
                colorSelected,
                sizeSelected,
                quantity,
                addedAt: new Date().toISOString(),
              },
            },
          });
        } else {
          const currentProducts = cartDoc.data().products || {};

          // Check if the product with the selected color and size already exists
          const productKey = `${productId}-${colorSelected}-${sizeSelected}`;
          const currentProduct = currentProducts[productKey];

          if (currentProduct) {
            // If the product exists, update the quantity
            transaction.update(cartRef, {
              [`products.${productKey}.quantity`]:
                currentProduct.quantity + quantity,
            });
          } else {
            // If the product doesn't exist (same color, different size), add it as a new item
            transaction.update(cartRef, {
              [`products.${productKey}`]: {
                colorSelected,
                sizeSelected,
                quantity,
                addedAt: new Date().toISOString(),
              },
            });
          }
        }
      });

      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        //navigation.navigate('CartScreen');
      }, 2000);
    } catch (error) {
      console.error('Error adding product to cart: ', error);
    }
  };
//Fetch product reviews and calculate average rating

  const fetchProductReviews = async () => {
    try {
      const reviewsSnapshot = await firestore()
        .collection('reviews') // Collection cha
        .doc(id) // Document ID cho sản phẩm
        .collection('productReviews') // Sub-collection chứa các đánh giá
        .get();

      const reviews = reviewsSnapshot.docs.map(doc => doc.data());

      // Tính số lượng đánh giá
      const count = reviews.length;
      setReviewsCount(count);

      if (count === 0) {
        setAverageRating(0); // Không có đánh giá
        return;
      }

      // Tính trung bình số sao
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const average = totalRating / count;

      setAverageRating(average);
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error);
    }
  };

  // Gọi hàm khi component được mount
  useEffect(() => {
    fetchProductReviews();
  }, [id]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Section
        styles={{
          zIndex: 5,
          position: 'absolute',
          top: 10,
          right: 0,
          left: 0,
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
      <ScrollView>
        {productDetail && (
          <>
            <View>
              <Image
                source={{
                  uri:
                    productDetail.variations.find(
                      (v: {color: string}) => v.color === colorSelected,
                    )?.image || productDetail.imageUrl, // Provide a fallback image if no match is found
                }}
                style={{width: '100%', height: 375}}
              />
            </View>
            <View
              style={[
                globalStyles.container,
                {
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  marginTop: -20,
                },
              ]}>
              <Section
                styles={{
                  paddingVertical: 12,
                  backgroundColor: colors.gray200,
                  borderTopStartRadius: 30,
                  borderTopEndRadius: 30,
                }}>
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Col>
                    <TextComponent
                      text={productDetail?.title}
                      font={fontFamilies.RobotoBold}
                      size={20}
                    />
                    <TextComponent
                      text={`$${productDetail.price}`}
                      size={24}
                      font={fontFamilies.poppinsBold}
                      color={colors.danger}
                    />
                  </Col>

                  <Row
                    justifyContent="flex-end"
                    styles={{
                      backgroundColor: colors.gray300,
                      padding: 6,
                      borderRadius: 100,
                      flex: 0.28,
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
                      style={{paddingRight: 12}}
                      onPress={() => setCount(count + 1)}>
                      <Add size={24} color={colors.black} />
                    </TouchableOpacity>
                  </Row>
                </Row>

                <Row justifyContent="space-between">
                  <TextComponent
                    text={productDetail.type}
                    color={colors.gray}
                    styles={{paddingVertical: 8}}
                  />
                  <Row justifyContent="flex-end">
                    {productDetail.variations
                      .find((v: {color: string}) => v.color === colorSelected)
                      ?.sizes.map((size: {sizeId: string}) => {
                        return (
                          <View key={size.sizeId}>
                            {sizeSelected === size.sizeId && (
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: 'bold',
                                  color: colors.black,
                                }}>
                                {size.quantity > 0 ? (
                                  <Text>
                                    Available Quantity: {size.quantity}
                                  </Text>
                                ) : (
                                  <TextComponent
                                    type="title"
                                    numberOfLine={1}
                                    color="red"
                                    ellipsizeMode="tail"
                                    text="Sản phẩm này hiện tại đã hết"
                                    size={16}
                                  />
                                )}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                  </Row>
                </Row>

                <Row
                  justifyContent="flex-start"
                  onPress={() =>
                    navigation.navigate('RatingScreen', {
                      productId: id,
                    })
                  }>
                  <Rating
                    startingValue={averageRating}
                    readonly
                    ratingCount={5}
                    ratingBackgroundColor="coral"
                    imageSize={20}
                  />
                  <Space width={12} />
                  <TextComponent text={`(${reviewsCount} Reviews)`} size={14} />
                </Row>

                <TextComponent
                  font={fontFamilies.RobotoBold}
                  text="Size"
                  size={18}
                />
                <Space height={16} />
                <Row wrap="wrap" justifyContent="flex-start">
                  {productDetail.variations
                    .find((v: {color: string}) => v.color === colorSelected)
                    ?.sizes.map((size: {sizeId: string}) => {
                      // Check sizes before calling find
                      if (!Array.isArray(sizes)) {
                        console.error('sizes is not an array:', sizes);
                        return null;
                      }

                      const sizeData = sizes.find(s => s.id === size.sizeId);

                      return (
                        <View>
                          <Button
                            key={size.sizeId}
                            title={sizeData?.sizeName || 'Unknown'}
                            onPress={() => handleSizeChange(size.sizeId)}
                            color={
                              sizeSelected === size.sizeId
                                ? colors.black
                                : colors.gray
                            }
                            styles={{margin: 5}}
                          />
                        </View>
                      );
                    })}
                </Row>

                <TextComponent
                  text="Color"
                  font={fontFamilies.RobotoMedium}
                  size={16}
                />
                <Row wrap="wrap" justifyContent="flex-start">
                  {productDetail.variations.map((variation: any) => (
                    <TouchableOpacity
                      key={variation.color}
                      onPress={() => handleColorChange(variation.color)}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          margin: 5,
                          backgroundColor: variation.colorCode,
                          borderRadius: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                        }}>
                        {colorSelected === variation.color && (
                          <Ionicons
                            name="checkmark-circle"
                            size={25} // Size of the checkmark icon
                            color={colors.white} // White color for the checkmark
                            style={{position: 'absolute'}}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
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

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('RatingScreen', {
                      productId: id,
                    })
                  }>
                  <Row
                    styles={{
                      justifyContent: 'space-between',
                      marginTop: 15,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 16,
                      }}>
                      Đánh giá của khách hàng
                    </Text>
                    <Row>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                        }}>
                        Xem thêm
                      </Text>
                      <MaterialIcons
                        name="navigate-next"
                        size={28}
                        color="gray"
                      />
                    </Row>
                  </Row>
                </TouchableOpacity>
              </Section>
            </View>
          </>
        )}
      </ScrollView>
      <Section styles={{backgroundColor: 'white', paddingTop: 10}}>
        <Row>
          <Col>
            {productDetail && count && (
              <Col>
                <TextComponent
                  text="Total price:"
                  size={14}
                  color={colors.black}
                />
                <TextComponent
                  text={`$${productDetail.price * count}`}
                  size={24}
                  font={fontFamilies.poppinsBold}
                  color={colors.danger}
                />
              </Col>
            )}
          </Col>
          <Col>
            <Button
              icon={
                <FontAwesome6 name="comment-dots" size={18} color={'white'} />
              }
              inline
              onPress={() => navigation.navigate('ChatScreen')}
              color={colors.gray}
              title={'Chat'}
            />
          </Col>
          <Space width={5}></Space>
          {productDetail &&
            productDetail.variations &&
            (productDetail.variations
              .find((v: {color: string}) => v.color === colorSelected)
              ?.sizes.find(
                (size: {sizeId: string}) => size.sizeId === sizeSelected,
              )?.quantity > 0 ? (
              <Button
                icon={<FontAwesome6 name="cart-plus" size={18} color="white" />}
                inline
                onPress={() =>
                  handleAddToCart(
                    userId,
                    id,
                    colorSelected,
                    sizeSelected,
                    count,
                  )
                }
                color={colors.black}
                title={'Add to cart'}
              />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.gray,
                  padding: 12,
                  borderRadius: 20,
                  alignItems: 'center',
                }}
                disabled>
                <Text style={{color: colors.white, fontWeight: 'bold'}}>
                  Out to Stock
                </Text>
              </TouchableOpacity>
            ))}
        </Row>
      </Section>
      <Dialog.Container contentStyle={{borderRadius: 15}} visible={visible}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/cartSuccess.png')}
            style={{
              width: 50,
              height: 50,
              marginTop: 20,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
              fontSize: 30,
              color: 'black',
            }}>
            Thêm vào giỏ hàng thành công
          </Text>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default ProductDetail;
