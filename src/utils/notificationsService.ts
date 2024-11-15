// src/utils/NotificationService.ts
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export default class NotificationService {
  static registerForPushNotifications = async () => {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            // Lưu token vào Firestore
            await firestore().collection('tokens').doc(fcmToken).set({});
        }
    }
};

  // static requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled = 
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Trạng thái quyền:', authStatus);
  //     await this.getFcmToken();
  //   }
  // };
// Yêu cầu quyền thông báo từ người dùng
static  requestUserPermission= async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = 
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
      console.log('Quyền thông báo đã được cấp.');
      await this.getFcmToken();
  } else {
      console.log('Người dùng không cấp quyền thông báo.');
  }
}
  static getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      try {
        const tokenDoc = await firestore().collection('tokens').doc(fcmToken).get();
        if (!tokenDoc.exists) {
          await firestore().collection('tokens').doc(fcmToken).set({});
          console.log('FCM Token đã được lưu vào Firestore:', fcmToken);
        } else {
          console.log('Token đã tồn tại trong Firestore:', fcmToken);
        }
      } catch (error) {
        console.error('Lỗi khi lưu FCM Token:', error);
      }
    }
  };

  static onMessageListener = () => {
    return messaging().onMessage(async remoteMessage => {
      Alert.alert('Tin nhắn mới!', JSON.stringify(remoteMessage.notification));
    });
  };
// Lắng nghe thông báo khi ứng dụng ở trạng thái nền hoặc bị đóng
static setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Thông báo nền nhận được:', remoteMessage);
    // Có thể thực hiện một hành động nào đó khi nhận thông báo trong nền
    // Ví dụ: Hiển thị một thông báo hệ thống hoặc lưu vào cơ sở dữ liệu
  });
};
  
}
