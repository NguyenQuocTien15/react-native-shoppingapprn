import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userRef } from '../firebase/firebaseConfig';
import auth from '@react-native-firebase/auth'
/**
 * Quản lý việc cấp quyền và lấy FCM token
 */
export default class PermissionNotificationService {
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
      if (!storedToken) {
        const token = await messaging().getToken();
        if (token) {
          await AsyncStorage.setItem('fcmtoken', token);
          console.log('FCM Token mới:', token);
        }
      } else {
        console.log('FCM Token đã lưu:', storedToken);
      }
    } catch (error) {
      console.error('Lỗi khi lấy FCM Token:', error);
    }
  };
  /**
   * Cập nhật FCM token trong Firestore.
   */
  static updateFcmTokenToDatabase = async (token: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await userRef.doc(user.uid).get();
        const tokens = userDoc.data()?.tokens || [];
        
        if (!tokens.includes(token)) {
          await userRef.doc(user.uid).update({ tokens: [...tokens, token] });
          console.log('Token đã được cập nhật.');
        }
      } else {
        console.log('Không có người dùng nào đang đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật token:', error);
    }
  };
}
