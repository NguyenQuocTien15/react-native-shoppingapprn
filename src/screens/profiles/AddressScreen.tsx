import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { userRef } from '../../firebase/firebaseConfig';
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const AddressSelector = () => {
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
    const country = 'Việt Nam';

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
                Alert.alert('Lỗi', 'Không thể tải dữ liệu tỉnh/thành phố.');
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    const data = await response.json();
                    console.log('Districts:', data.districts); // Log danh sách huyện
                    setDistricts(data.districts || []);
                    setSelectedDistrict(''); // Reset district khi thay đổi province
                    setWards([]); // Reset wards khi thay đổi province
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);


    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    const data = await response.json();
                    setWards(data.wards || []);
                    setSelectedWard(''); // Reset ward khi thay đổi district
                } catch (error) {
                    console.error('Error fetching wards:', error);
                    Alert.alert('Lỗi', 'Không thể tải dữ liệu xã/phường.');
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);


    //   useEffect(() => {
    //     const fetchUserData = async () => {
    //       try {
    //         const userId = getAuth().currentUser?.uid;
    //         if (!userId) return;

    //         // Lấy tài liệu của người dùng từ Firestore
    //         const userDocRef = doc(userRef, userId); // Tạo tham chiếu đến document
    //         const userDoc = await getDoc(userDocRef); // Lấy dữ liệu document

    //         // Kiểm tra nếu dữ liệu tồn tại
    //         if (userDoc.exists) {
    //           const userData = userDoc.data(); // Lấy dữ liệu từ document
    //           console.log('User Data:', userData);

    //           // Cập nhật các state với dữ liệu từ Firestore
    //           setUserName(userData?.displayName || '');
    //           setPhoneNumber(userData?.phoneNumber || '');
    //           setHouseNumber(userData?.houseNumber || '');

    //           // Xử lý tỉnh/huyện/xã dựa vào tên lưu trong Firestore
    //           const provinceCode = provinces.find(p => p.name === userData?.province)?.code || '';
    //           const districtCode = districts.find(d => d.name === userData?.district)?.code || '';
    //           const wardCode = wards.find(w => w.name === userData?.ward)?.code || '';

    //           setSelectedProvince(provinceCode);
    //           setSelectedDistrict(districtCode);
    //           setSelectedWard(wardCode);
    //         } else {
    //           console.log('User document does not exist!');
    //         }
    //       } catch (error) {
    //         console.error('Error fetching user data:', error);
    //         Alert.alert('Lỗi', 'Không thể tải dữ liệu người dùng từ Firestore.');
    //       }
    //     };

    //     // Chỉ gọi hàm khi dữ liệu tỉnh/thành phố đã được tải xong
    //     if (provinces.length > 0) fetchUserData();
    //   }, [provinces]);

    const [isUserDataFetched, setIsUserDataFetched] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getAuth().currentUser?.uid;
                if (!userId) return;

                const userDocRef = doc(userRef, userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setUserName(userData?.displayName || '');
                    setPhoneNumber(userData?.phoneNumber || '');
                    setHouseNumber(userData?.houseNumber || '');

                    const province = provinces.find((p) => p.name === userData?.province);
                    setSelectedProvince(province?.code || '');

                    // Tự động cập nhật huyện và xã nếu có
                    if (province) {
                        const responseDistrict = await fetch(
                            `https://provinces.open-api.vn/api/p/${province.code}?depth=2`
                        );
                        const districtData = await responseDistrict.json();
                        setDistricts(districtData.districts || []);

                        const district = districtData.districts.find(
                            (d) => d.name === userData?.district
                        );
                        setSelectedDistrict(district?.code || '');

                        if (district) {
                            const responseWard = await fetch(
                                `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
                            );
                            const wardData = await responseWard.json();
                            setWards(wardData.wards || []);

                            const ward = wardData.wards.find((w) => w.name === userData?.ward);
                            setSelectedWard(ward?.code || '');
                        }
                    }
                }
                setIsUserDataFetched(true); // Đánh dấu dữ liệu đã được tải
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Chỉ gọi khi provinces đã được tải và dữ liệu chưa được tải
        if (provinces.length > 0 && !isUserDataFetched) {
            fetchUserData();
        }
    }, [provinces, districts, wards]);


    // Update full address when user modifies address fields
    useEffect(() => {
        if (houseNumber && selectedWard && selectedDistrict && selectedProvince) {
            const provinceName = provinces.find(p => p.code === selectedProvince)?.name;
            const districtName = districts.find(d => d.code === selectedDistrict)?.name;
            const wardName = wards.find(w => w.code === selectedWard)?.name;

            const updatedFullAddress = `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}, ${country}`;
            setFullAddress(updatedFullAddress);
        }
    }, [houseNumber, selectedProvince, selectedDistrict, selectedWard]);

    // Handle save address
    const handleConfirmAddress = async () => {
        if (!userName || !phoneNumber || !houseNumber || !selectedWard) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const userId = getAuth().currentUser?.uid;
            if (!userId) {
                console.log('User  not logged in');
                return;
            }

            const userDocRef = doc(userRef, userId);
            const provinceName = provinces.find(p => p.code === selectedProvince)?.name || '';
            const districtName = districts.find(d => d.code === selectedDistrict)?.name || '';
            const wardName = wards.find(w => w.code === selectedWard)?.name || '';
            const updatedFullAddress = `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}, ${country}`;

            const updatedData = {
                displayName: userName,
                phoneNumber: phoneNumber,
                houseNumber: houseNumber,
                country: country,
                province: provinceName,
                district: districtName,
                ward: wardName,
                fullAddress: updatedFullAddress,
            };

            await updateDoc(userDocRef, updatedData);
            Alert.alert('Thành công', 'Địa chỉ đã được lưu.');
            setIsEditing(false); // Đặt lại chế độ chỉnh sửa
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin địa chỉ.');
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
                            editable={isEditing} // Cho phép chỉnh sửa khi ở chế độ chỉnh sửa
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số điện thoại hợp lệ..."
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="numeric"
                            editable={isEditing} // Cho phép chỉnh sửa khi ở chế độ chỉnh sửa
                        />
                    </View>
                    <Text style={styles.label}>Thông tin địa chỉ</Text>
                    <View style={styles.customView}>
                        <Picker
                            selectedValue={selectedProvince}
                            onValueChange={(value) => setSelectedProvince(value)}
                            enabled={isEditing} // Chỉ cho phép chọn khi ở chế độ chỉnh sửa
                        >
                            <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                            {provinces.map((province) => (
                                <Picker.Item key={province.code} label={province.name} value={province.code} />
                            ))}
                        </Picker>

                        <Picker
                            selectedValue={selectedDistrict}
                            onValueChange={(value) => setSelectedDistrict(value)}
                            enabled={isEditing && !!selectedProvince} // Chỉ cho phép chọn khi ở chế độ chỉnh sửa
                        >
                            <Picker.Item label="Chọn quận/huyện" value="" />
                            {districts.map((district) => (
                                <Picker.Item key={district.code} label={district.name} value={district.code} />
                            ))}
                        </Picker>

                        <Picker
                            selectedValue={selectedWard}
                            onValueChange={(value) => setSelectedWard(value)}
                            enabled={isEditing && !!selectedDistrict} // Chỉ cho phép chọn khi ở chế độ chỉnh sửa
                        >
                            <Picker.Item label="Chọn xã/phường" value="" />
                            {wards.map((ward) => (
                                <Picker.Item key={ward.code} label={ward.name} value={ward.code} />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.label}>Thông tin địa chỉ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Số nhà..."
                        value={houseNumber}
                        onChangeText={setHouseNumber}
                        editable={isEditing} // Cho phép chỉnh sửa khi ở chế độ chỉnh sửa
                    />

                    <Text style={styles.label}>Địa chỉ đầy đủ</Text>
                    <Text style={styles.fullAddress}>
                        {houseNumber && selectedWard && selectedDistrict && selectedProvince ? (
                            `${houseNumber}, ${wards.find(w => w.code === selectedWard)?.name}, ${districts.find(d => d.code === selectedDistrict)?.name}, ${provinces.find(p => p.code === selectedProvince)?.name}, ${country}`
                        ) : (
                            "Vui lòng chọn địa chỉ đầy đủ"
                        )}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={isEditing ? handleConfirmAddress : () => setIsEditing(true)} // Chuyển đổi giữa chế độ chỉnh sửa và lưu
                >
                    <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    customView: {
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: '#ff7891',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fullAddress: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
});

export default AddressSelector;