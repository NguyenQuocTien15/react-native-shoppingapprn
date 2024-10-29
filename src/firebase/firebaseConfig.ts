import firestore, { getFirestore } from '@react-native-firebase/firestore';


const productRef = firestore().collection('products');
const categoriesRef = firestore().collection('categories');
const userRef = firestore().collection('users');
const orderRef = firestore().collection('orders')
const orderDetailRef = firestore().collection('order_details');
const orderStatusRef = firestore().collection('orderStatus')
export const db = getFirestore();
export {
  productRef,
  categoriesRef,
  userRef,
  orderRef,
  orderStatusRef,
  orderDetailRef
};