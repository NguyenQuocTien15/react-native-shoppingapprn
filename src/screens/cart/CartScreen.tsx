import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Col, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {Minus, Add} from 'iconsax-react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Dialog from 'react-native-dialog';
import auth from '@react-native-firebase/auth';
import {dbFirestore, productRef, userRef} from '../../firebase/firebaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {deleteDoc, doc, firebase} from '@react-native-firebase/firestore';
const CartScreen = () => {
  const navigation = useNavigation();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);

      const cartRef = userRef
        .doc(currentUser.uid)
        .collection('cart')
        .doc('cartDoc');

      const unsubscribe = cartRef.onSnapshot(async doc => {
        if (doc.exists) {
          const products = doc.data().products;

          const productDetails = await Promise.all(
            Object.keys(products).map(async productId => {
              const productDoc = await firebase
                .firestore()
                .collection('products')
                .doc(productId)
                .get();

              const addedAt = products[productId].addedAt;

              return {
                productId,
                imageUrl: productDoc.data().imageUrl,
                quantity: products[productId].quantity,
                title: productDoc.data().title,
                description: productDoc.data().description,
                sizes: productDoc.data().size,
                price: productDoc.data().price,
                addedAt: addedAt ? new Date(addedAt) : new Date(),
              };
            }),
          );

          const sortedProductDetails = productDetails.sort(
            (a, b) => b.addedAt - a.addedAt,
          );

          setCartItems(sortedProductDetails);
        } else {
          console.log('Giỏ hàng trống');
        }
      });

      return () => unsubscribe(); // Hủy theo dõi khi component bị unmount
    } else {
      console.log('Không có người dùng đăng nhập');
    }
  }, []);
  useEffect(() => {
    const fetchCartItems = async () => {
      const cartRef = dbFirestore.collection('carts').doc('userId');
      const doc = await cartRef.get();
      if (doc.exists) {
        setCartItems(doc.data().products);
      }
    };

    fetchCartItems();
  }, []);

  const updateCart = async (userId, productId, quantity) => {
    const cartRef = firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('cart')
      .doc('cartDoc');

    try {
      await firebase.firestore().runTransaction(async transaction => {
        const cartDoc = await transaction.get(cartRef);

        if (!cartDoc.exists) {
          console.log('Cart does not exist.');
          return;
        }

        const currentProducts = cartDoc.data().products || {};
        const currentQuantity = currentProducts[productId]?.quantity || 0;

        if (currentQuantity + quantity < 0) {
          return;
        }

        transaction.update(cartRef, {
          [`products.${productId}`]: {quantity: currentQuantity + quantity},
        });

        setCartItems(prevItems => {
          const updatedItems = [...prevItems];
          const itemIndex = updatedItems.findIndex(
            item => item.productId === productId,
          );
          if (itemIndex > -1) {
            updatedItems[itemIndex].quantity += quantity;

            if (updatedItems[itemIndex].quantity <= 0) {
              updatedItems.splice(itemIndex, 1);
            }
          }
          return updatedItems;
        });
      });

      console.log('Cart updated successfully!');
    } catch (error) {
      console.error('Error updating cart: ', error);
    }
  };

  const handleDecrease = productId => {
    const currentProduct = cartItems.find(item => item.productId === productId);
    if (currentProduct && currentProduct.quantity > 0) {
      updateCart(userId, productId, -1);
    }
  };

  const handleIncrease = productId => {
    updateCart(userId, productId, 1);
  };

  const showDialog = (item: React.SetStateAction<null>) => {
    setSelectedItem(item);
    setDialogVisible(true);
  };
  const getUserId = () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      return currentUser.uid;
    } else {
      console.log('No user is signed in.');
      return null;
    }
  };
  const userID = getUserId();
  const handleCancel = () => {
    setDialogVisible(false);
  };

  const toggleSelectProduct = item => {
    setSelectedProducts(prevSelected => {
      const isSelected = prevSelected.includes(item.productId);
      const updatedSelected = isSelected
        ? prevSelected.filter(id => id !== item.productId)
        : [...prevSelected, item.productId];

      // Check if all items are selected
      if (updatedSelected.length === cartItems.length) {
        setIsSelectAll(true); // All items are selected
      } else {
        setIsSelectAll(false); // Not all items are selected
      }

      return updatedSelected;
    });
  };

  const handleChooseAll = () => {
    if (isSelectAll) {
      setSelectedProducts([]);
      setIsSelectAll(false);
    } else {
      setSelectedProducts(cartItems.map(item => item.productId)); // Use productId here
      setIsSelectAll(true);
    }
  };

  const calculateTotalPrice = () => {
    if (isSelectAll) {
      return cartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      );
    } else if (selectedProducts.length > 0) {
      return cartItems
        .filter(item => selectedProducts.includes(item.productId)) // Use productId here
        .reduce((total, item) => total + item.quantity * item.price, 0);
    }

    return 0;
  };

  const handleRemoveFromCart = async (
    userId: string | null | undefined,
    productId: string | number,
  ) => {
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    const cartRef = firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('cart')
      .doc('cartDoc');

    try {
      await firebase.firestore().runTransaction(async transaction => {
        const cartDoc = await transaction.get(cartRef);

        if (cartDoc.exists) {
          const currentProducts = cartDoc.data()?.products || {};

          if (currentProducts[productId]) {
            delete currentProducts[productId];

            transaction.update(cartRef, {
              products: currentProducts,
            });
            setDialogVisible(false);
            console.log('Product removed from cart successfully!');
          } else {
            console.warn('Product not found in cart:', productId);
          }
        } else {
          console.warn('Cart does not exist.');
        }
      });
    } catch (error) {
      console.error('Error removing product from cart: ', error);
    }
  };

  const handleCheckOut = () => {
    const selectedItems = cartItems.filter(item =>
      selectedProducts.includes(item.productId),
    );

    if (selectedItems.length > 0) {
      navigation.navigate('CheckOut', {selectedItems});
    } else {
      Alert.alert('Please select at least one product to checkout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCart}>Carts({cartItems.length})</Text>
      {cartItems.length > 0 ? (
        <View style={{flex: 1, marginTop: 10}}>
          <SwipeListView
            style={{marginHorizontal: 10, marginBottom: 10}}
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <View key={item.productId} style={styles.itemListProduct}>
                <Row alignItems="center" styles={{margin: 10}}>
                  <Col flex={0.15}>
                    <TouchableOpacity onPress={() => toggleSelectProduct(item)}>
                      <View style={styles.radioCircle}>
                        {selectedProducts.includes(item.productId) && (
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
                    }}
                  />
                  <Space width={12} />
                  <Col>
                    <TextComponent
                      type="title"
                      numberOfLine={1}
                      ellipsizeMode="tail"
                      text={item.title}
                      size={20}
                    />
                    <TextComponent
                      numberOfLine={1}
                      ellipsizeMode="tail"
                      text={item.description}
                    />
                    <TextComponent
                      numberOfLine={1}
                      ellipsizeMode="tail"
                      text={item.sizes}
                    />
                    <TextComponent text={item.size} />
                    <Row flex={1} alignItems="flex-end">
                      <Col>
                        <TextComponent
                          type="title"
                          text={`$${item.price * item.quantity}`}
                          size={20}
                        />
                      </Col>
                      <Row
                        styles={{
                          backgroundColor: '#e0e0e0',
                          paddingVertical: 4,
                          borderRadius: 100,
                          paddingHorizontal: 12,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleDecrease(item.productId)}>
                          <Minus size={20} color="black" />
                        </TouchableOpacity>
                        <Space width={6} />
                        <TextComponent text={`${item.quantity}`} />
                        <Space width={6} />
                        <TouchableOpacity
                          onPress={() => handleIncrease(item.productId)}>
                          <Add size={20} color="black" />
                        </TouchableOpacity>
                      </Row>
                    </Row>
                  </Col>
                </Row>
              </View>
            )}
            // Phần render khi vuốt sang trái để xóa
            renderHiddenItem={({item}) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnRight]}
                  onPress={() => showDialog(item)}>
                  <MaterialIcons name="delete" size={30} color="white" />
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
                <Dialog.Container visible={dialogVisible}>
                  <Dialog.Title>Delete {selectedItem?.title}?</Dialog.Title>

                  <Dialog.Description>
                    Are you sure you want to remove this {selectedItem?.title}
                    product from your cart?
                  </Dialog.Description>
                  <Dialog.Button label="Cancel" onPress={handleCancel} />
                  <Dialog.Button
                    label="Delete"
                    onPress={() =>
                      handleRemoveFromCart(userID, selectedItem?.productId)
                    }
                  />
                </Dialog.Container>
              </View>
            )}
            rightOpenValue={-75} // Độ rộng vuốt sang trái để xóa
          ></SwipeListView>

          <View style={styles.flexDirectionChooseAll}>
            <TouchableOpacity onPress={handleChooseAll}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              {`$${calculateTotalPrice().toLocaleString()}`}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.touchCheckOut,
              {
                backgroundColor:
                  selectedProducts.length > 0 ? '#ff7891' : 'gray',
              },
            ]}
            disabled={selectedProducts.length === 0}
            onPress={handleCheckOut}>
            <Text style={styles.textCheckOut}>Check Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="small" color="#0000ff" />
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
    borderRadius: 15,
    marginBottom: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DD2C00',
    flex: 0.9,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flexDirection: 'column',
  },
  backRightBtnRight: {
    backgroundColor: '#DD2C00',
    right: 10,
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 20,
  },
});
