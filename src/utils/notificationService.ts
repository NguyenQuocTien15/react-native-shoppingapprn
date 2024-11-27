 /**
 * NotificationService.ts
 * Chứa các hàm liên quan đến việc lưu thông báo vào Firestore
 */

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Notification } from '@bsdaoquang/rncomponent';

import { userRef } from '../firebase/firebaseConfig';

const serviceAccount = require('../../shopping-app-3-serviceaccount-firebase.json');
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
/**
 * Lưu Access Token vào bộ nhớ tạm (cache) và kiểm tra thời gian hết hạn (thường là 1 giờ) trước khi tạo token mới.
 * 
 */
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export default class NotificationService {
  static getAccesstoken = async () => {
    try {
      const res = await Notification.getAccesstoken({
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      });


      return (res.access_token);

    } catch (error) {
      console.log(error);
    }
  };
  static pushNotification = async (
    uid: string,
    notificationData: { title: string; body: string; },
    values: any
  ) => {
    try {
      const snap = await userRef.doc(uid).get();
  
      if (!snap.exists) {
        console.error(`Không tìm thấy người dùng với UID: ${uid}`);
        return;
      }
  
      const data: any = snap.data();
  
      if (!data.tokens || data.tokens.length === 0) {
        console.error(`Người dùng ${uid} không có token hợp lệ.`);
        return;
      }
  
      const accessToken = await this.getAccesstoken();
      if (!accessToken) {
        console.error('Không lấy được Access Token.');
        return;
      }
  
      for (const token of data.tokens) {
        try {
          const myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json');
          myHeaders.append('Authorization', `Bearer ${accessToken}`);
  
          const raw = JSON.stringify({
            message: {
              token,
              notification: {
                title: notificationData.title,
                body: notificationData.body,
              },
              data: values,
            },
          });
  
          const requestOptions: any = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };
  
          const res = await fetch(
            'https://fcm.googleapis.com/v1/projects/shopping-app-3-410c2/messages:send',
            requestOptions
          );
  
          const result = await res.json();
  
          if (res.ok) {
            console.log('Thông báo đã gửi thành công:', result);
          } else {
            console.error('Lỗi từ FCM:', result);
          }
        } catch (error) {
          console.error('Lỗi khi gửi thông báo cho token:', token, error);
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông báo:', error);
    }
  };

 /**
 * Lưu thông báo vào Firestore
 * @param orderId ID đơn hàng
 * @param status Trạng thái đơn hàng
 */
static async saveNotificationToFirestore(orderId: string, status: string) {
  const userId = auth().currentUser?.uid;

  if (!userId) {
    console.error('User ID is not available');
    return;
  }

  // Kiểm tra giá trị của các trường trước khi lưu vào Firestore
  if (!orderId || !status) {
    console.error('Order ID or status is undefined or empty');
    return;
  }

  // Xử lý body của thông báo tùy thuộc vào trạng thái
  let body = '';
  switch (status) {
    case '1': // Đang xử lý
      body = `Đơn hàng của bạn (#${orderId}) đang được xử lý. Vui lòng chờ...`;
      break;
    case '0': // Đã hủy
      body = `Đơn hàng (#${orderId}) của bạn đã bị hủy.`;
      break;
    case '2': // Đã đóng gói
      body = `Đơn hàng (#${orderId}) của bạn đã được đóng gói và sẵn sàng vận chuyển.`;
      break;
    case '3': // Đang vận chuyển
      body = `Đơn hàng (#${orderId}) của bạn đang trên đường đến nơi.`;
      break;
    case '4': // Đã giao
      body = `Đơn hàng (#${orderId}) của bạn đã được giao thành công.`;
      break;
    case '5': // Đã nhận lại hàng
      body = `Đơn hàng (#${orderId}) đã được nhận lại.`;
      break;
    default:
      body = `Trạng thái của đơn hàng (#${orderId}) đã thay đổi.`;
  }

  const notificationData = {
    body,
    createdAt: firestore.FieldValue.serverTimestamp(),
    orderId, // ID đơn hàng
    status,  // Trạng thái đơn hàng
    title: 'Trạng thái đơn hàng',
    userId,  // ID người dùng nhận thông báo
  };

  try {
    // Lưu thông báo vào Firestore
    await firestore().collection('notifications').add(notificationData);
    console.log('Thông báo đã được lưu vào Firestore');
  } catch (error) {
    console.error('Lỗi khi lưu thông báo vào Firestore:', error);
  }
}

}
