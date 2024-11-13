import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import CartNavigator from './CartNavigator';
import NotificationNavigator from './NotificationNavigator';
import ProfileNavigator from './ProfileNavigator';
import {colors} from '../constants/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  CardTick1,
  Notification,
  Profile,
  ShoppingBag,
  ShoppingCart,
} from 'iconsax-react-native';
import {TextComponent} from '../components';
import {Row} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../constants/fontFamilies';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MyOrders from '../screens/order/MyOrders';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
        tabBarIcon: ({focused, size, color}) => {
          color = focused ? colors.white : colors.dark;
          size = focused ? 14 : 20;
          let icon = <Entypo name="home" size={size} color={color} />;
          switch (route.name) {
            case 'Cart':
              icon = (
                <ShoppingCart variant="TwoTone" size={size} color={color} />
              );
              break;
            case 'MyOrders':
              icon = (
                <ShoppingBag variant="TwoTone" size={size} color={color} />
              );
              break;
            case 'Notification':
              icon = 
                <Notification variant="TwoTone" size={size} color={color} />
            ;
              break;
            case 'Profile':
              icon = <Profile variant="TwoTone" size={size} color={color} />;
              break;
            default:
              icon = <Entypo name="home" size={size} color={color} />;

              break;
          }
          return (
            <Row styles={focused ? {backgroundColor: colors.gray} : undefined}>
              <View style={focused ? styles.iconContainer : undefined}>
                {icon}
              </View>
              {focused && (
                <TextComponent
                  styles={{
                    paddingHorizontal: 6,
                    fontSize: 11,
                    fontFamily: fontFamilies.poppinsMedium,
                  }}
                  text={route.name}
                />
              )}
            </Row>
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={({route}) => ({
          tabBarStyle: (route => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (routeName === 'CheckOut') {
              return {display: 'none'};
            }
            
            return {
              backgroundColor: colors.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            };
          })(route),
        })}
      />
      <Tab.Screen name="MyOrders" component={MyOrders} />
      <Tab.Screen name="Notification" component={NotificationNavigator} />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={({route}) => ({
          tabBarStyle: (route => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            
            if (routeName === 'ChangePassword') {
              return {display: 'none'};
            }
            if (routeName === 'Address') {
              return {display: 'none'};
            }
            return {
              backgroundColor: colors.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            };
          })(route),
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});