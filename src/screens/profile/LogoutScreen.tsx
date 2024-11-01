import { View, Text, Button } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';

const LogoutScreen = ({ navigation }:any) => {
  const handleLogout = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Chỉ thực hiện đăng xuất nếu có người dùng đang đăng nhập
        await auth().signOut();
        navigation.replace('Login'); // Điều hướng về màn hình đăng nhập
      } else {
        console.log("No user currently signed in.");
      }
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Are you sure you want to log out?</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
