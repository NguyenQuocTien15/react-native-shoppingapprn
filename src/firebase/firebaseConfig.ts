import firestore from '@react-native-firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const productRef = firestore().collection('products');
const categoriesRef = firestore().collection('categories');
const userRef = firestore().collection('users');
const orderRef = firestore().collection('orders');


export {
  productRef,
  categoriesRef,
  userRef,
  orderRef,
};