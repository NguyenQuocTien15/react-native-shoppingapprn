import firestore, { getFirestore } from '@react-native-firebase/firestore';

export const db = firestore(); 
export const dbFirestore = getFirestore(); 
export const productRef = db.collection('products');
export const categoriesRef = db.collection('categories');
export const userRef = db.collection('users');
export const orderRef = db.collection('orders');
export const orderStatusRef = db.collection('orderStatus');
export const cartRef = db.collection('carts');
