


// import { initializeApp } from 'firebase/app'; // Hoặc từ '@react-native-firebase/app' nếu dùng thư viện Firebase cho React Native
// import { getFirestore } from 'firebase/firestore'; // Hoặc từ '@react-native-firebase/firestore' nếu dùng thư viện Firebase cho React Native
// import { getAuth } from 'firebase/auth'; // Hoặc từ '@react-native-firebase/auth' nếu dùng thư viện Firebase cho React Native
// import firestore from '@react-native-firebase/firestore';
// // Cấu hình Firebase
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// // Khởi tạo Firebase
// const app = initializeApp(firebaseConfig);

// // Khởi tạo các dịch vụ Firebase
// const db = getFirestore(app);
// const auth = getAuth(app);



// export const ac = firestore(); 
// export const dbFirestore = getFirestore(); 
// export const productRef = ac.collection('products');
// export const categoriesRef = ac.collection('categories');
// export const brandsRef = ac.collection('brands');
// export const userRef = ac.collection('users');
// export const orderRef = ac.collection('orders');
// export const orderHistoryRef = ac.collection('orderHistory');
// export const orderDetailRef = ac.collection('order_details');
// export const orderStatusRef = ac.collection('orderStatus');
// export const cartRef = ac.collection('carts');
// export const offerRef = ac.collection('offer');
// export const reviewsRef = ac.collection('reviews');
// export const chatsRef = ac.collection('chats');
// export const offerId = offerRef.id;

// // Export Firebase services
// export { db, auth };
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Khởi tạo các dịch vụ Firebase
const db = firestore();  // Sử dụng @react-native-firebase/firestore
const authInstance = auth();  // Sử dụng @react-native-firebase/auth

// Các tham chiếu đến các collection trong Firestore
export const productRef = db.collection('products');
export const categoriesRef = db.collection('categories');
export const brandsRef = db.collection('brands');
export const userRef = db.collection('users');
export const orderRef = db.collection('orders');
export const orderHistoryRef = db.collection('orderHistory');
export const orderDetailRef = db.collection('order_details');
export const orderStatusRef = db.collection('orderStatus');
export const cartRef = db.collection('carts');
export const offerRef = db.collection('offer');
export const reviewsRef = db.collection('reviews');
export const chatsRef = db.collection('chats');

// Export các dịch vụ Firebase
export { db, authInstance as auth };
