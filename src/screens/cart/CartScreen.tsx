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
import auth, {getAuth} from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {firebase} from '@react-native-firebase/firestore';
const CartScreen = () => {
  const navigation = useNavigation();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const userId = getAuth().currentUser?.uid;
  const sizeNameSelected = {
    1: 'S',
    2: 'M',
    3: 'L',
    4: 'XL',
    5: 'XXL',
  };
  const fetchCartProducts = (
    userId: string | null | undefined,
    setCartItems: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    if (!userId) {
      console.error('User ID is null or undefined.');
      setCartItems([]);
      return;
    }

    const cartRef = firebase.firestore().collection('carts').doc(userId);
    const productsRef = firebase.firestore().collection('products');
    const colorRef = firebase.firestore().collection('colors');

    return cartRef.onSnapshot(
      async cartDoc => {
        if (cartDoc.exists) {
          const cartData = cartDoc.data();
          const cartProducts = cartData?.products || {};

          const productKeys = Object.keys(cartProducts);
          const productList: any[] = [];

          for (const key of productKeys) {
            const {colorSelected, sizeSelected, quantity} = cartProducts[key];

            // Extract productId from the key (assuming the format: productId-color-size)
            const [productId] = key.split('-');

            try {
              const productDoc = await productsRef.doc(productId).get();
              const colorDoc = await colorRef.doc(colorSelected).get();

              if (productDoc.exists && colorDoc.exists) {
                const productData = productDoc.data();
                const colorData = colorDoc.data();
                const sizeName = sizeNameSelected[sizeSelected]; // Assuming `sizeNameSelected` is a mapping object

                productList.push({
                  productKey: key,
                  productId,
                  colorSelected,
                  colorName: colorData?.colorName,
                  sizeSelected,
                  sizeName,
                  quantity,
                  ...productData, // Spread product details (e.g., name, imageUrl, price)
                });
              } else {
                if (!productDoc.exists) {
                  console.warn(`Product with ID ${productId} not found.`);
                }
                if (!colorDoc.exists) {
                  console.warn(`Color with ID ${colorSelected} not found.`);
                }
              }
            } catch (error) {
              console.error(
                `Error fetching product details for ${productId}: `,
                error,
              );
            }
          }

          setCartItems(productList);
        } else {
          console.log('Cart is empty.');
          setCartItems([]);
        }
      },
      error => {
        console.error('Error listening to cart changes: ', error);
      },
    );
  };

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = fetchCartProducts(userId, setCartItems);

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
    setDialogVisible(false);
  }, [userId]);

  const updateCart = async (userId, productId, quantity) => {
    const cartRef = firebase.firestore().collection('carts').doc(userId);

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
    setSelectedItem(null);
  };

  const toggleSelectProduct = item => {
    // Create a unique key for the selected item based on productId, color, and size
    const productKey = `${item.productId}-${item.colorSelected}-${item.sizeSelected}`;

    setSelectedProducts(prevSelected => {
      // Check if the item is already selected
      const isSelected = prevSelected.includes(productKey);
      const updatedSelected = isSelected
        ? prevSelected.filter(key => key !== productKey) // Remove if already selected
        : [...prevSelected, productKey]; // Add if not selected

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
      setSelectedProducts([]); // Deselect all
      setIsSelectAll(false);
    } else {
      // Select all items by including unique product keys
      const allSelectedKeys = cartItems.map(
        item => `${item.productId}-${item.colorSelected}-${item.sizeSelected}`,
      );
      setSelectedProducts(allSelectedKeys);
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
    colorSelected: string,
    sizeSelected: string,
  ) => {
    if (!userId) {
      Alert.alert('User not logged in');
      return;
    }

    const cartRef = firebase.firestore().collection('carts').doc(userId);

    try {
      await firebase.firestore().runTransaction(async transaction => {
        const cartDoc = await transaction.get(cartRef);

        if (!cartDoc.exists) {
          Alert.alert('Cart not found');
          return;
        }

        const currentProducts = cartDoc.data()?.products || {};
        const productKey = `${productId}-${colorSelected}-${sizeSelected}`;
        const currentProduct = currentProducts[productKey];

        if (!currentProduct) {
          Alert.alert('Product not found in cart');
          return;
        }

        // Remove the product from the cart
        const updatedProducts = {...currentProducts};
        delete updatedProducts[productKey];

        // If there are no products left in the cart, delete the cart document
        if (Object.keys(updatedProducts).length === 0) {
          transaction.delete(cartRef);
        } else {
          transaction.update(cartRef, {
            products: updatedProducts,
          });
          setDialogVisible(false);
        }
      });

    } catch (error) {
      console.error('Error removing product from cart: ', error);
      Alert.alert('Error removing product from cart');
    }
  };

  const handleCheckOut = () => {
    // Filter selected items based on the selected product IDs
    const selectedItems = cartItems.filter(item =>
      selectedProducts.includes(
        `${item.productId}-${item.colorSelected}-${item.sizeSelected}`,
      ),
    );

    if (selectedItems.length > 0) {
      
      const itemsToSend = selectedItems.map(item => ({
        productId: item.productId,
        title: item.title,
        imageUrl: item.imageUrl,
        size: item.sizeName,
        quantity: item.quantity,
        color: item.colorName,
        colorSelected: item.colorSelected,
        sizeSelected: item.sizeSelected,
        price: item.price,
      }));

      // Navigate to checkout with the selected items
      navigation.navigate('CheckOut', {selectedItems: itemsToSend});
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
            keyExtractor={item =>
              `${item.productId}-${item.colorSelected}-${item.sizeSelected}`
            }
            renderItem={({item, index}) => (
              <View key={item.productId} style={styles.itemListProduct}>
                <Row alignItems="center" styles={{margin: 10}}>
                  <Col flex={0.15}>
                    <TouchableOpacity onPress={() => toggleSelectProduct(item)}>
                      <View style={styles.radioCircle}>
                        {selectedProducts.includes(
                          `${item.productId}-${item.colorSelected}-${item.sizeSelected}`,
                        ) && <View style={styles.selectedRb} />}
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
                      text={`${item.colorName} - ${item.sizeName}`}
                      size={17}
                    />

                    <Row flex={1} alignItems="flex-end">
                      <Col>
                        <TextComponent
                          type="title"
                          text={`$${item.price}`}
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
                  <Dialog.Title>
                    {selectedItem
                      ? `Delete ${selectedItem.title}?`
                      : 'Deleting Item'}
                  </Dialog.Title>

                  <Dialog.Description>
                    Are you sure you want to remove this {selectedItem?.title}
                    product from your cart?
                  </Dialog.Description>
                  <Dialog.Button label="Cancel" onPress={handleCancel} />
                  <Dialog.Button
                    label="Delete"
                    onPress={() =>
                      handleRemoveFromCart(
                        userID,
                        selectedItem?.productId,
                        selectedItem?.colorSelected,
                        selectedItem?.sizeSelected,
                      )
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
        <Text style={{color: 'black', padding: 10}}>Giỏ hàng trống</Text>
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
    marginTop: 10,
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
