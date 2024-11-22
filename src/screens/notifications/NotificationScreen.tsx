import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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

    const unsubscribe = listenToNotifications({
      userId,
      onNotification: (fetchedNotifications) => {
        setNotifications(fetchedNotifications);
        setLoading(false);
      },
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Đang tải thông báo...</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có thông báo mới.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.notificationContainer}>
          {/* Hình ảnh đơn hàng */}
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          )}
          <View style={styles.textContainer}>
            {/* Mã đơn hàng */}
            <Text style={styles.orderId}>Mã đơn hàng: {item.orderId || 'Không có mã'}</Text>

            {/* Ngày đặt */}
            <Text style={styles.orderDate}>
              Ngày đặt: {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'Không xác định'}
            </Text>

            {/* Trạng thái đơn hàng */}
            <Text style={styles.orderStatus}>
              Trạng thái: {item.orderStatus || 'Đang chuẩn bị'}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'black',
  },
  notificationContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  orderId: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  orderDate: {
    color: 'gray',
    fontSize: 14,
    marginTop: 4,
  },
  orderStatus: {
    color: 'green',
    fontSize: 14,
    marginTop: 4,
  },
});

export default NotificationScreen;
