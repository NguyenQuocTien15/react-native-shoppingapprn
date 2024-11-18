// src/utils/NotificationService.ts

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import { userRef } from '../firebase/firebaseConfig';

export default class NotificationService {
  
  /**
   * Yêu cầu quyền thông báo từ người dùng.
   * Nếu được cấp quyền, lấy FCM token và lưu vào Firestore.
   */
  static requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Quyền thông báo đã được cấp.');
        await this.getFCMToken();
      } else {
        console.log('Người dùng không cấp quyền thông báo.');
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thông báo:', error);
    }
  };

  /**
   * Lấy FCM token và lưu vào Firestore nếu chưa được lưu.
   */
  static getFCMToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('fcmtoken');
      if (storedToken) {
        // Nếu token đã lưu trong AsyncStorage, cập nhật nó vào Firestore
        await this.updateFcmTokenToDatabase(storedToken);
      } else {
        // Nếu chưa có token, lấy token mới từ Firebase Messaging
        const token = await messaging().getToken();
        if (token) {
          await AsyncStorage.setItem('fcmtoken', token);
          await this.updateFcmTokenToDatabase(token);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy FCM token:', error);
    }
  };

  /**
   * Cập nhật FCM token trong bảng `users` với trường tên `token`.
   * @param token - FCM token cần lưu.
   */
  static updateFcmTokenToDatabase = async (token: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Lưu token vào trường `token` trong bảng `users`
        await userRef.doc(user.uid).update({
          token: token,
        });
        console.log('FCM token đã được lưu thành công vào Firestore.');
      } else {
        console.log('Không có người dùng nào đang đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật token vào Firestore:', error);
    }
  };

  /**
   * Lắng nghe thông báo khi ứng dụng đang chạy ở chế độ foreground.
   */
  static onMessageListener = () => {
    return messaging().onMessage(async remoteMessage => {
      Alert.alert('Thông báo mới!', JSON.stringify(remoteMessage.notification));
    });
  };

  /**
   * Xử lý thông báo khi ứng dụng ở chế độ nền hoặc bị đóng.
   */
  static setBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Thông báo nền nhận được:', remoteMessage);
      // Thực hiện hành động mong muốn với thông báo nền
    });
  };
}
