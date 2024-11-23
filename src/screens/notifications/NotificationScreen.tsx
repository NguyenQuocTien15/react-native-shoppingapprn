import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const listenToNotifications = ({ userId, onNotification }) => {
  if (!userId) {
    console.error('User ID is not valid');
    return;
  }

  const unsubscribe = firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      onNotification(notifications);
    });

  return unsubscribe;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      console.error('User ID is not available');
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);
// Handle notification deletion
const handleDeleteNotification = async (notificationId: string) => {
  try {
    await firestore().collection('notifications').doc(notificationId).delete();
    console.log('Notification deleted successfully');
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông báo...</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{color:'black'}}>Chưa có thông báo mới.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (

        <Swipeable
        renderRightActions={() => (
          <View style={styles.deleteButton}>
            <Text style={styles.deleteText}>Xóa</Text>
          </View>
        )}
        onSwipeableRightOpen={() => handleDeleteNotification(item.id)} // Delete notification on swipe
      >
        <View style={styles.notificationContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>

          {/* Mã đơn hàng */}
          <Text style={styles.orderId}>Mã đơn hàng: {item.orderId}</Text>

          {/* Trạng thái */}
          <Text style={styles.status}>Trạng thái: {item.status}</Text>

          {/* Ngày thông báo */}
          <Text style={styles.date}>
          Ngày tạo: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'Không xác định'}
          </Text>
        </View>
        </Swipeable>
      )}
    />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color:'black'
  },
  notificationContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  orderId: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  status: {
    fontSize: 14,
    color: '#FF6347', // red for status
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 80,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationScreen;

