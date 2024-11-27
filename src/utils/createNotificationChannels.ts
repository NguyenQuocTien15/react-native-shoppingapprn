import notifee, { AndroidImportance } from '@notifee/react-native';

export async function createNotificationChannels() {
  try {
    await notifee.createChannel({
        id: 'message_channel',
        name: 'Message Notifications',
        importance: AndroidImportance.HIGH,
      });
    
      await notifee.createChannel({
        id: 'order_channel',
        name: 'Order Notifications',
        importance: AndroidImportance.HIGH,
      });
    
      console.log('Notification channels created.');
  } catch (error) {
    console.error('Error creating notification channels:', error);
  }
}
