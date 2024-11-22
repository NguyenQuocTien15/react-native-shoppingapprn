import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { userRef } from '../firebase/firebaseConfig';
// Thay đổi cách export hàm displayNotification
export async function displayNotification(title: string, body: string) {
  const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
      title,
      body,
      android: {
          channelId,
          smallIcon: 'ic_launcher',
      },
  });
}


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
        await this.updateFcmTokenToDatabase(storedToken);
      } else {
        const token = await messaging().getToken();
        if (token) {
          await AsyncStorage.setItem('fcmtoken', token);
          await this.updateFcmTokenToDatabase(token);
          console.log('Token:', token);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy FCM token:', error);
    }
  };

  /**
   * Cập nhật FCM token trong Firestore.
   */
  static updateFcmTokenToDatabase = async (token: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await userRef.doc(user.uid).update({ token });
        console.log('FCM token đã được lưu vào Firestore.');
      } else {
        console.log('Không có người dùng nào đang đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu token vào Firestore:', error);
    }
  };

  /**
   * Lắng nghe thông báo khi ứng dụng đang chạy ở chế độ foreground.
   */
  static onMessageListener = () => {
    return messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        await this.displayNotification(
          remoteMessage.notification.title ?? 'Thông báo mới',
          remoteMessage.notification.body ?? 'Bạn có tin nhắn mới!'
        );
      }
    });
  };

  /**
   * Xử lý thông báo khi ứng dụng ở chế độ nền hoặc bị đóng.
   */
  static setBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { notification } = remoteMessage;
      if (notification) {
        // Hiển thị thông báo bằng Notifee
        //@ts-ignore
        await this.displayNotification(notification.title, notification.body);
      }
    });
  };

  /**
   * Hiển thị thông báo sử dụng Notifee.
   */
  static displayNotification = async (title: string, body: string) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Icon nhỏ cần cấu hình
      },
    });
  };

  
}
