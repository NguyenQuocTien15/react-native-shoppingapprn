import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { Row } from '@bsdaoquang/rncomponent';
import Avatar from '../../components/Avatar';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  const notificationTemplate = {
    from: '',
    to: '',
    createdAt: Date.now(),
    content: 'Nội dung thông báo mẫu',
    isRead: false,
  };

  useEffect(() => {
    // Tạo danh sách thông báo mẫu
    const items = Array.from({ length: 10 }, (_, index) => ({
      ...notificationTemplate,
      id: index + 1, // ID duy nhất
    }));
    setNotifications(items); // Đổi thành `[]` để kiểm tra giao diện không có thông báo
  }, []);

  // Hàm render từng thông báo
  const renderItem = ({ item }) => (
    <Row style={styles.row}>
      <Avatar />
      <Text style={styles.notificationText}>{item.content}</Text>
    </Row>
  );

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
      keyExtractor={(item) => item.id.toString()}
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
