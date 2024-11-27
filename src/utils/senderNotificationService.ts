import { userRef } from '../firebase/firebaseConfig';
/**
 * Quản lý việc gửi thông báo:
 */
export default class SenderNotificationService {
  static pushNotification = async (
    uid: string,
    notificationData: { title: string; body: string },
    dataPayload: Record<string, string>
  ) => {
    try {
      const userDoc = await userRef.doc(uid).get();
      if (!userDoc.exists) {
        console.error('Không tìm thấy người dùng:', uid);
        return;
      }

      const tokens = userDoc.data()?.tokens || [];
      if (tokens.length === 0) {
        console.error('Người dùng không có token để gửi thông báo.');
        return;
      }

      for (const token of tokens) {
        try {
          const response = await fetch(
            'https://fcm.googleapis.com/v1/projects/shopping-app-3-410c2/messages:send',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ACCESS_TOKEN`,
              },
              body: JSON.stringify({
                message: {
                  token,
                  notification: notificationData,
                  data: dataPayload,
                },
              }),
            }
          );

          const result = await response.json();
          if (!response.ok) {
            console.error('Lỗi từ FCM:', result);
          } else {
            console.log('Thông báo đã gửi thành công:', result);
          }
        } catch (error) {
          console.error('Lỗi khi gửi thông báo:', error);
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông báo:', error);
    }
  };
}
