import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Button} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localDataNames} from '../../constants/localDataNames';
import {removeAuth} from '../../redux/reducers/authReducer';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handlePersonalDetails = () => {
    navigation.navigate('Personal')
  };

  return (
    <View style={{flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 20}}>
      <TouchableOpacity
        onPress={handlePersonalDetails}
        style={styles.touchableOpacity}>
        <FontAwesome5
          name="user-edit"
          size={24}
          color="black"
          style={{flex: 0.1}}
        />
        <Text style={styles.textTouch}>Personal Details</Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('MyOrder')}
        style={styles.touchableOpacity}>
        <FontAwesome5
          name="shopping-bag"
          size={24}
          color="black"
          style={{flex: 0.1}}
        />
        <Text style={styles.textTouch}>My Orders</Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChangePassword')}
        style={styles.touchableOpacity}>
        <MaterialIcons
          name="password"
          size={24}
          color="black"
          style={{flex: 0.1}}
        />
        <Text style={styles.textTouch}>ChangPassword</Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Address')}
        style={styles.touchableOpacity}>
        <FontAwesome5
          name="shipping-fast"
          size={24}
          color="black"
          style={{flex: 0.1}}
        />
        <Text style={styles.textTouch}>Address</Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await auth().signOut();
          await AsyncStorage.removeItem(localDataNames.auth);
          dispatch(removeAuth({}));
        }}
        style={styles.touchableOpacity}>
        <AntDesign name="logout" size={24} color="black" style={{flex: 0.1}} />
        <Text style={styles.textTouch}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  textTouch: {flex: 1, marginLeft: 15, fontSize: 20, color: 'black'},
});
export default ProfileScreen;
