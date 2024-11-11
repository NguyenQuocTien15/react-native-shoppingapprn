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
import {
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
const db = getFirestore();
const AddressSelector = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();

        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
      }
    };
    fetchProvinces();
  }, []);
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`,
          );
          const data = await response.json();
          setDistricts(data.districts || []);
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setWards([]);
          setSelectedDistrict('');
          setSelectedWard('');
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
          );
          const data = await response.json();
          setWards(data.wards || []);
        } catch (error) {
          console.error('Error fetching wards:', error);
        } finally {
          setSelectedWard('');
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const userId = getAuth().currentUser?.uid;
  //       if (!userId) {
  //         console.log('User not logged in');
  //         return;
  //       }
  //       const userDoc = await userRef.doc(userId).get();
  //       if (userDoc.exists) {
  //         const userData = userDoc.data();
  //         setUserName(userData?.displayName || '');
  //         setPhoneNumber(userData?.phoneNumber || '');
  //         setHouseNumber(userData?.houseNumber || '');
  //         setFullAddress(userData?.fullAddress || ''); // Fetch and display fullAddress if exists
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };
  //   fetchUser();
  // }, []);
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
          setFullAddress(userData?.fullAddress || '');

          // Set selected values for province, district, and ward
          const provinceCode =
            provinces.find(p => p.name === userData?.province)?.code || '';
          const districtCode =
            districts.find(d => d.name === userData?.district)?.code || '';
          const wardCode =
            wards.find(w => w.name === userData?.ward)?.code || '';

          setSelectedProvince(provinceCode);
          setSelectedDistrict(districtCode);
          setSelectedWard(wardCode);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch user data and set the province, district, and ward values
    fetchUser();
  }, [provinces, districts, wards]);

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
      const userDocRef = doc(userRef, userId);

      // Concatenate to create the full address
      const provinceName =
        provinces.find(p => p.code === selectedProvince)?.name || '';
      const districtName =
        districts.find(d => d.code === selectedDistrict)?.name || '';
      const wardName = wards.find(w => w.code === selectedWard)?.name || '';
      const fullAddress = `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`;

      const updatedData = {
        displayName: userName,
        phoneNumber: phoneNumber,
        houseNumber: houseNumber || '',
        province: provinceName,
        district: districtName,
        ward: wardName,
        fullAddress: fullAddress, // Use the concatenated full address
      };

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
          <View style={styles.customView}>
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
          <Text style={styles.label}>Thông tin địa chỉ</Text>
          <View style={styles.customView}>
            <Picker
              selectedValue={selectedProvince}
              onValueChange={value => setSelectedProvince(value)}>
              <Picker.Item label="Chọn tỉnh/thành phố" value="" />
              {provinces.map(province => (
                <Picker.Item
                  key={province.code}
                  label={province.name}
                  value={province.code}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={value => setSelectedDistrict(value)}
              enabled={!!selectedProvince}>
              <Picker.Item label="Chọn quận/huyện" value="" />
              {districts.map(district => (
                <Picker.Item
                  key={district.code}
                  label={district.name}
                  value={district.code}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedWard}
              onValueChange={value => setSelectedWard(value)}
              enabled={!!selectedDistrict}>
              <Picker.Item label="Chọn xã/phường" value="" />
              {wards.map(ward => (
                <Picker.Item
                  key={ward.code}
                  label={ward.name}
                  value={ward.code}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Thông tin địa chỉ</Text>
          <View style={styles.customView}>
            <TextInput
              style={styles.input}
              placeholder="Nhập thông tin địa chỉ..."
              value={houseNumber}
              onChangeText={setHouseNumber}
            />
          </View>
          {selectedWard &&
          selectedDistrict &&
          selectedProvince &&
          houseNumber ? (
            <View>
              <Text style={styles.label}>Địa chỉ của bạn</Text>
              <View style={styles.customView}>
                <Text style={{color:'black', fontSize:18}}>{fullAddress}</Text>
              </View>
            </View>
          ) : (
            <Text>''</Text>
          )}
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
  customView: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
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
