//import liraries
import React, { useState } from 'react';
import MainNavigator from './src/routers/MainNavigator';
import AuthNavigator from './src/routers/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';


const App = () => {
 //ng dung chi duoc vao app khi dang nhap thanh cong
 const [isLogin, setIsLogin] = useState(false);
  return (
  <NavigationContainer>
    {
      1 < 2 ? <MainNavigator/> : <AuthNavigator/>
    }
  </NavigationContainer>

  );

};
export default App;
