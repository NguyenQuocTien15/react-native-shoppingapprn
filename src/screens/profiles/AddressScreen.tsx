import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {userRef} from '../../firebase/firebaseConfig'; // Make sure the path is correct
import {getAuth} from '@react-native-firebase/auth';
import { doc, getFirestore, setDoc, updateDoc } from '@react-native-firebase/firestore';
const db = getFirestore()
const AddressSelector = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = getAuth().currentUser?.uid;
        if (!userId) {
          console.log('User not logged in');
          return;
        }
        const userDoc = await userRef.doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData?.displayName || '');
          setPhoneNumber(userData?.phoneNumber || '');
          setHouseNumber(userData?.houseNumber || '');
          setFullAddress(userData?.fullAddress || ''); // Fetch and display fullAddress if exists
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleConfirmAddress = async () => {
    if (!phoneNumber) {
      Alert.alert('Vui lòng nhập số điện thoại');
      return;
    }

    try {
      const userId = getAuth().currentUser?.uid;
      if (!userId) {
        console.log('User not logged in');
        return;
      }

      // Lấy reference tới user document trong Firestore
      const userDocRef = await userRef.doc(userId);

     
      const updatedData = {
        displayName: userName,
        phoneNumber: phoneNumber,
        houseNumber: houseNumber || '', 
        fullAddress: fullAddress || '', 
      };

      console.log('Updated Data:', updatedData);

      // Thêm hoặc cập nhật dữ liệu vào Firestore mà không ghi đè các trường cũ
      await updateDoc(userDocRef, updatedData);

      Alert.alert('Thông tin đã được lưu');
    } catch (error) {
      console.error('Error updating user data: ', error);
      Alert.alert('Lỗi khi lưu thông tin');
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.label}>Thông tin liên hệ</Text>
          <View style={{backgroundColor: 'white', padding: 10}}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên...."
              value={userName}
              onChangeText={setUserName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại hợp lệ..."
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Nhập số nhà</Text>
          <View style={{backgroundColor: 'white', padding: 10}}>
            <TextInput
              style={styles.input}
              placeholder="Số nhà..."
              value={houseNumber}
              onChangeText={setHouseNumber}
            />
          </View>

          <Text style={styles.label}>Địa chỉ đầy đủ</Text>
          <View style={{backgroundColor: 'white', padding: 10}}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ đầy đủ..."
              value={fullAddress}
              onChangeText={setFullAddress}
            />
          </View>
        </View>
      </ScrollView>

      <View style={{margin: 10}}>
        <TouchableOpacity
          style={styles.touchCheckOut}
          onPress={handleConfirmAddress}>
          <Text style={styles.textCheckOut}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    color: 'gray',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  touchCheckOut: {
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ff7891',
  },
  textCheckOut: {
    color: 'white',
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddressSelector;
