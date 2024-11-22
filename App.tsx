import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Router from './src/routers/Router';

import PermissionNotificationService from './src/utils/permissionNotificationService';
import ListenerNotificationService from './src/utils/listenerNotificationService';
import MessageNotificationService from './src/utils/messageNotificationService';
import OrderNotificationService from './src/utils/orderNotificationService';
import { createNotificationChannels } from './src/utils/createNotificationChannels';

const App = () => {
  useEffect(() => {
    // Yêu cầu quyền thông báo
    PermissionNotificationService.requestUserPermission();

    // Tạo kênh thông báo
    createNotificationChannels();

    // Khởi tạo listener cho từng loại thông báo
    ListenerNotificationService.setupForegroundListener();
    ListenerNotificationService.setupBackgroundHandler();
     // Đăng ký listener và lưu các hàm unsubscribe
     const messageUnsubscribe = MessageNotificationService.setupMessageNotificationListener();
     const orderUnsubscribe = OrderNotificationService.setupOrderNotificationListener();
 

    // Cleanup listener khi component bị hủy
    return () => {
      // Thêm logic cleanup ở đây
      if (messageUnsubscribe) messageUnsubscribe();
      if (orderUnsubscribe) orderUnsubscribe();
    };
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
