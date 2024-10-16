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

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handlePersonalDetails = () => {
    console.log('aaaaaaaaaaaaa');
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <TouchableOpacity
        onPress={handlePersonalDetails}
        style={styles.touchableOpacity}>
        <Icon name="person" size={24} color="black" />
        <Text style={{flex: 1, marginLeft: 15, fontSize: 20, color: 'black'}}>
          Personal Details
        </Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={ () => navigation.navigate('MyOrders') }
        style={styles.touchableOpacity}>
        <Icon name="bag-check-outline" size={24} color="black" />
        <Text style={{flex: 1, marginLeft: 15, fontSize: 20, color: 'black'}}>
          My Orders
        </Text>
        <Icon name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <Button
        title="Logout"
        onPress={async () => {
          await auth().signOut();
          await AsyncStorage.removeItem(localDataNames.auth);
          dispatch(removeAuth({}));
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
});
export default ProfileScreen;
