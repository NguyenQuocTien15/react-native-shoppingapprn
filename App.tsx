// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Router from './src/routers/Router';
import  NotificationService from './src/utils/notificationService';

const App = () => {
  useEffect(() => {
    // Yêu cầu quyền và lấy token FCM
    NotificationService.requestUserPermission();
    //notificationService.registerForPushNotifications();
    // Lắng nghe thông báo khi ứng dụng đang mở
    const unsubscribe = NotificationService.onMessageListener();
    NotificationService.setBackgroundMessageHandler();

    return unsubscribe; // Dọn dẹp listener khi component bị hủy
  }, []);

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Router />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
