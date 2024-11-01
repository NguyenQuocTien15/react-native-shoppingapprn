import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
// import {Picker} from '@react-native-picker/picker';

const AddressSelector = () => {
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);

//   const [selectedProvince, setSelectedProvince] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [selectedWard, setSelectedWard] = useState('');
//   const [houseNumber, setHouseNumber] = useState('');

//   const [isCity, setIsCity] = useState(false);
//   const [isProvincialCity, setIsProvincialCity] = useState(false);
//   const [loadingProvinces, setLoadingProvinces] = useState(true);
//   const [loadingDistricts, setLoadingDistricts] = useState(false);
//   const [loadingWards, setLoadingWards] = useState(false);

//   useEffect(() => {
//     // Lấy danh sách tỉnh/thành phố
//     const fetchProvinces = async () => {
//       try {
//         const response = await fetch('https://provinces.open-api.vn/api/p/');
//         const data = await response.json();
//         setProvinces(data);
//       } catch (error) {
//         console.error('Error fetching provinces:', error);
//       } finally {
//         setLoadingProvinces(false);
//       }
//     };
//     fetchProvinces();
//   }, []);

//   useEffect(() => {
//     // Reset và lấy quận/huyện khi tỉnh/thành phố được chọn
//     if (selectedProvince) {
//       setLoadingDistricts(true);
//       setIsCity(false);
//       const fetchDistricts = async () => {
//         try {
//           const response = await fetch(
//             `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`,
//           );
//           const data = await response.json();
//           setDistricts(data.districts || []);
//           if (data.division_type === 'thành phố trung ương') {
//             setIsCity(true);
//           }
//           console.log(data.division_type);
//         } catch (error) {
//           console.error('Error fetching districts:', error);
//         } finally {
//           setLoadingDistricts(false);
//           setWards([]);
//           setSelectedDistrict('');
//           setSelectedWard('');
//           setHouseNumber(''); // Reset số nhà khi chọn tỉnh/thành khác
//         }
//       };
//       fetchDistricts();
//     }
//   }, [selectedProvince]);

//   useEffect(() => {
//     // Reset và lấy xã/phường khi quận/huyện được chọn
//     if (selectedDistrict) {
//       setLoadingWards(true);
//       const fetchWards = async () => {
//         try {
//           const response = await fetch(
//             `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
//           );
//           const data = await response.json();
//           setWards(data.wards || []);
//           setIsProvincialCity(data.division_type === 'thành phố')
//         } catch (error) {
//           console.error('Error fetching wards:', error);
//         } finally {
//           setLoadingWards(false);
//           setSelectedWard('');
//         }
//       };
//       fetchWards();
//     }
//   }, [selectedDistrict]);

//   const handleConfirmAddress = () => {

//     // Check if the selected option is a city and if house number is missing
//     if (isCity && !houseNumber) {
//       Alert.alert('Lỗi', 'Vui lòng nhập số nhà vì bạn đã chọn thành phố.');
//       return;
//     }
//     if (isProvincialCity && !houseNumber) {
//       Alert.alert('Lỗi', 'Vui lòng nhập số nhà vì bạn đã chọn thành phố tỉnh.');
//       return;
//     }

//     // Process further if the address is valid
//     const address = `Địa chỉ: ${selectedProvince} - ${selectedDistrict} - ${selectedWard}`;
//     const houseInfo = isCity && houseNumber ? `, Số nhà: ${houseNumber}` : '';
//     Alert.alert('Địa chỉ đã chọn', address + houseInfo);
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chọn Tỉnh/Thành phố:</Text>
      </View>
//       {loadingProvinces ? (
//         <ActivityIndicator size="small" color="#0000ff" />
//       ) : (
//         <Picker
//           selectedValue={selectedProvince}
//           onValueChange={itemValue => setSelectedProvince(itemValue)}
//           style={styles.picker}>
//           <Picker.Item label="-- Chọn Tỉnh/Thành phố --" value="" />
//           {provinces.map(province => (
//             <Picker.Item
//               key={province.code}
//               label={province.name}
//               value={province.code}
//             />
//           ))}
//         </Picker>
//       )}

//       <Text style={styles.label}>Chọn Quận/Huyện:</Text>
//       {loadingDistricts ? (
//         <ActivityIndicator size="small" color="#0000ff" />
//       ) : (
//         <Picker
//           selectedValue={selectedDistrict}
//           onValueChange={itemValue => setSelectedDistrict(itemValue)}
//           style={styles.picker}
//           enabled={!!selectedProvince}>
//           <Picker.Item label="-- Chọn Quận/Huyện --" value="" />
//           {districts.map(district => (
//             <Picker.Item
//               key={district.code}
//               label={district.name}
//               value={district.code}
//             />
//           ))}
//         </Picker>
//       )}

//       <Text style={styles.label}>Chọn Xã/Phường:</Text>
//       {loadingWards ? (
//         <ActivityIndicator size="small" color="#0000ff" />
//       ) : (
//         <Picker
//           selectedValue={selectedWard}
//           onValueChange={itemValue => setSelectedWard(itemValue)}
//           style={styles.picker}
//           enabled={!!selectedDistrict}>
//           <Picker.Item label="-- Chọn Xã/Phường --" value="" />
//           {wards.map(ward => (
//             <Picker.Item key={ward.code} label={ward.name} value={ward.code} />
//           ))}
//         </Picker>
//       )}

//       <Text style={styles.label}>Nhập Số Nhà:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Số nhà..."
//         value={houseNumber}
//         onChangeText={setHouseNumber}
//       />

//       <Button title="Xác nhận địa chỉ" onPress={handleConfirmAddress} />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'black',
  },
//   picker: {
//     height: 50,
//     width: '100%',
//     backgroundColor: '#f2f2f2',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     width: '100%',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     marginBottom: 16,
//   },
//   customText: {
//     fontSize: 20,
//     color: 'black',
//   },
});

export default AddressSelector;
