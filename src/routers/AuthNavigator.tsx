import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeAuth, Login, Result, SignUp} from '../screens';
import SwiperScreen from '../screens/auth/SwiperScreen';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar translucent backgroundColor={'white'} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeAuth" component={HomeAuth} />
        <Stack.Screen name="SwiperScreen" component={SwiperScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
