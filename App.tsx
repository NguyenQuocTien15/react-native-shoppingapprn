import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Router from './src/routers/Router';
import NotificationService from './src/utils/notificationService';
import {displayNotification} from './src/utils/notificationService';
import { Button, View, StyleSheet } from 'react-native';

const App = () => {
  useEffect(() => {
    // Yêu cầu quyền và lấy token FCM
    NotificationService.requestUserPermission();

    // Lắng nghe thông báo khi ứng dụng đang mở
    const unsubscribeForeground = NotificationService.onMessageListener();

    // Xử lý thông báo khi ứng dụng ở chế độ nền
    NotificationService.setBackgroundMessageHandler();

    return () => {
      // Dọn dẹp listener khi component bị hủy
      unsubscribeForeground();
    };
  }, []);

  const handleNotification = () => {
    displayNotification('Tiêu đề thông báo', 'Nội dung của thông báo');
  };

  return (
    <NavigationContainer>
      <Provider store={store}>
        {/* <View style={styles.container}>
          <Button title="Hiển thị thông báo" onPress={handleNotification} />
        </View> */}
        <Router />
      </Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
