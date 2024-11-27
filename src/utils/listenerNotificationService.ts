import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
/*
Quản lý việc xử lý thông báo:
*/
export default class ListenerNotificationService {
  static setupForegroundListener = () => {
    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        await notifee.displayNotification({
          title: title || 'Thông báo',
          body: body || 'Bạn có tin nhắn mới!',
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        });
      }
    });
  };

  static setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        await notifee.displayNotification({
          title: title || 'Thông báo',
          body: body || 'Bạn có tin nhắn mới!',
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        });
      }
    });
  };
}
