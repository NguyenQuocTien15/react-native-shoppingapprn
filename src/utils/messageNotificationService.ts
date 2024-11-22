import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

/**
 *  Quản lý thông báo tin nhắn (MessageNotificationService.ts)
 */
export default class MessageNotificationService {
  // Biến lưu trữ unsubscribe để hủy đăng ký sau này
  static unsubscribe: (() => void) | null = null;

  /**
   * Lắng nghe thông báo khi ứng dụng đang chạy ở foreground.
   * Trả về hàm `unsubscribe` để cleanup khi không cần thiết.
   */
  static setupMessageNotificationListener() {
    // Nếu đã có listener, bỏ qua không cần thiết
    if (this.unsubscribe) {
      console.log('Đã có listener, không cần thiết phải đăng ký lại.');
      return;
    }

    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: 'message_channel',
            smallIcon: 'ic_launcher', // Cần đảm bảo icon nhỏ tồn tại trong tài nguyên
          },
        });
      }
    });

    return this.unsubscribe; // Trả về hàm unsubscribe
  }

  /**
   * Xử lý thông báo khi ứng dụng ở chế độ background.
   */
  static setupBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: 'message_channel',
            smallIcon: 'ic_launcher',
          },
        });
      }
    });
  }

  /**
   * Hủy bỏ listener khi không cần thiết.
   */
  static removeMessageNotificationListener() {
    if (this.unsubscribe) {
      this.unsubscribe(); // Gọi hàm unsubscribe để hủy bỏ listener
      this.unsubscribe = null; // Đặt lại để tránh gọi lại lần nữa
      console.log('Đã gỡ bỏ listener');
    } else {
      console.log('Không có listener nào để gỡ bỏ');
    }
  }
}
