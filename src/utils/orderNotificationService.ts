import { Notification } from '@bsdaoquang/rncomponent';
/**
 * Quản lý thông báo đơn hàng (OrderNotificationService.ts)
 */

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import NotificationService from './notificationService'
export default class OrderNotificationService {
    static channelId = 'order_channel';

  /**
   * Lắng nghe thông báo đơn hàng khi ứng dụng ở foreground.
   * Trả về hàm `unsubscribe` để cleanup.
   */
  static setupOrderNotificationListener() {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.orderID) {
        const { orderID, orderStatus = 'Đang xử lý' } = remoteMessage.data;

        await this.sendOrderNotification(orderID, orderStatus);
        // Lưu thông báo vào Firestore
        await NotificationService.saveNotificationToFirestore(orderID, orderStatus);
      }
    });

    return unsubscribe; // Trả về hàm unsubscribe
  }

  /**
   * Xử lý thông báo đơn hàng khi ứng dụng ở chế độ background.
   */
  static setupBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage.data?.orderID) {
        const orderID = remoteMessage.data.orderID;
        const orderStatus = remoteMessage.data.orderStatus || 'Đang xử lý';

        await notifee.displayNotification({
          title: `Cập nhật đơn hàng: #${orderID}`,
          body: `Trạng thái: ${orderStatus}.`,
          android: {
            channelId: 'order_channel',
            smallIcon: 'ic_launcher',
          },
        });
      }
    });
  }

  static sendOrderNotification = async (orderID: string, orderStatus: string) => {
    try {
      // Kiểm tra kênh thông báo đã được tạo
      await notifee.createChannel({
        id: 'order',
        name: 'Order Notifications',
        importance: AndroidImportance.HIGH,
      });

      // Gửi thông báo
      await notifee.displayNotification({
        title: `Cập nhật đơn hàng: #${orderID}`,
        body: `Trạng thái: ${orderStatus}`,
        android: {
          channelId: 'order',
          smallIcon: 'ic_launcher',  // Biểu tượng nhỏ
        },
      });

      console.log('Thông báo đơn hàng đã được gửi thành công.');
    } catch (error) {
      console.error('Lỗi khi gửi thông báo đơn hàng:', error);
    }
  };
 /**
   * Kiểm tra và tạo kênh thông báo nếu chưa tồn tại
   */
 static async createNotificationChannel() {
    try {
      const channels = await notifee.getChannels();
      if (!channels.some(channel => channel.id === this.channelId)) {
        await notifee.createChannel({
          id: this.channelId,
          name: 'Order Notifications',
          importance: AndroidImportance.HIGH,
        });
      }
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
  
}
