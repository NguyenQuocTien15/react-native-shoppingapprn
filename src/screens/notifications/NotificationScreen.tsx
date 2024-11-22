import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { Row } from '@bsdaoquang/rncomponent';
import Avatar from '../../components/Avatar';
import firestore from '@react-native-firebase/firestore';

// Hàm lắng nghe thông báo từ Firestore
const listenToNotifications = (userId, onNotification) => {
  const unsubscribe = firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      onNotification(notifications); // Gọi callback để cập nhật danh sách
    });

  return unsubscribe; // Trả về hàm hủy đăng ký
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Hiển thị trạng thái tải dữ liệu

  useEffect(() => {
    const userId = 'currentUserId'; // Thay bằng ID người dùng thực tế

    // Lắng nghe thông báo từ Firestore
    const unsubscribe = listenToNotifications(userId, (fetchedNotifications) => {
      setNotifications(fetchedNotifications);
      setLoading(false); // Tắt trạng thái tải
    });

    // Hủy đăng ký lắng nghe khi màn hình bị unmount
    return () => unsubscribe();
  }, []);

  // Hàm render từng thông báo
  const renderItem = ({ item }) => (
    <Row style={styles.row}>
      <Avatar />
      <Text style={styles.notificationText}>{item.content}</Text>
    </Row>
  );

  // Hiển thị thông báo khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Đang tải thông báo...</Text>
      </View>
    );
  }

  // Kiểm tra nếu không có thông báo
  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/nonotification.png')}
          style={styles.image}
          accessible
          accessibilityLabel="Không có thông báo"
        />
        <Text style={styles.text}>Không có thông báo</Text>
      </View>
    );
  }

  // Hiển thị danh sách thông báo nếu có
  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#888',
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default NotificationScreen;
