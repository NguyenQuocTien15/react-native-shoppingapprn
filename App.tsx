//import liraries
import React, { useEffect, useState } from 'react';
import MainNavigator from './src/routers/MainNavigator';
import AuthNavigator from './src/routers/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Splash from './src/screens/Splash';

const App = () => {
 //ng dung chi duoc vao app khi dang nhap thanh cong
 const [isLogin, setIsLogin] = useState(false);
 const [isWellcome, setIsWellcome] = useState(true)

 useEffect(() => {
  const timeout = setTimeout(()=> {
    setIsWellcome(false);
  },1500);
  auth().onAuthStateChanged(user => {
    setIsLogin(user ? (user.uid ? true : false) : false);
  });
  return () => clearTimeout(timeout);
 }, []);
  return (
  <NavigationContainer>
    {isWellcome ? (
      <Splash/>
    ) : isLogin ? (
      <MainNavigator/>
    ) : (
      <AuthNavigator/>
    )
      
        
      
    }
  </NavigationContainer>

  );

};
export default App;
