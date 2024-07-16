import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import CartNavigator from './CartNavigator';
import NotificationNavigator from './NotificationNavigator';
import ProfileNavigator from './ProfileNavigator';
import {colors} from '../constants/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import { CardTick1, Notification, Profile, ShoppingCart } from 'iconsax-react-native';
import { TextComponent } from '../components';
import { Row } from '@bsdaoquang/rncomponent';
import { fontFamilies } from '../constants/fontFamilies';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({focused,size,color}) => {
          color = focused ? colors.white : colors.dark;
          size = focused ? 14 : 20;
          let icon = <Entypo name="home" size={size} color={color} />;
          switch (route.name) {
            case 'CartTab':
            icon = <ShoppingCart variant='TwoTone' size={size} color={color}/>
            break;
            case 'NotificationTab':
            icon = <Notification variant='TwoTone' size={size} color={color}/>
            break;
            case 'ProfileTab':
            icon = <Profile variant='TwoTone' size={size} color={color}/>
            break;
            default:
              icon = <Entypo name="home" size={size} color={color} />;

              break;
          }
          return (  
            <Row styles={focused ? { backgroundColor: colors.gray, } : undefined}>
            <View style={focused ? styles.iconContainer : undefined}>{icon}</View>
             {focused && (
                <TextComponent styles={{paddingHorizontal:6, fontSize: 11, fontFamily: fontFamilies.poppinsMedium}}
                text={route.name}/>
             )}
            </Row>
           
          );
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="CartTab" component={CartNavigator} />
      <Tab.Screen name="NotificationTab" component={NotificationNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
iconContainer: {
  width: 30,
  height:30,
  backgroundColor: colors.dark,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 100
}
});