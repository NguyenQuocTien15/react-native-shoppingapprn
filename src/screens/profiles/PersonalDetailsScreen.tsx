// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';  // Firebase Auth
// import { launchImageLibrary } from 'react-native-image-picker'; 
// import storage from '@react-native-firebase/storage';  // Firebase Storage

// const PersonalDetailsScreen = () => {
//   const [deliveryPerson, setDeliveryPerson] = useState<{
//     avatar: string | null;
//     email: string;
//     phoneNumber: string;
//   }>({
//     avatar: null,
//     email: '',
//     phoneNumber: '',
//   });

//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth().currentUser;  // Lấy người dùng hiện tại từ Firebase Authentication

//         if (user) {
//           const userDocRef = firestore().collection('users').doc(user.uid);  // Truy vấn tài liệu người dùng từ Firestore
//           const userDocSnap = await userDocRef.get();

//           if (userDocSnap.exists) {
//             const userData = userDocSnap.data();
//             setDeliveryPerson({
//               avatar: userDocSnap.data().avatar || null,
//               email: userData.email || '',
//               phoneNumber: userData.phoneNumber || '',
//             });
//           } else {
//             console.log('Không tìm thấy tài liệu người dùng!');
//           }
//         } else {
//           console.log('Người dùng chưa đăng nhập');
//         }
//       } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu người dùng:', error);
//         Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
//       }
//     };

//     fetchUserData();
//   }, []);  // Chỉ chạy một lần khi component được mount

// //   const handleSave = async () => {
// //     try {
// //       const user = auth().currentUser;
// //       if (user) {
// //         const userDocRef = firestore().collection('users').doc(user.uid);

// //         // Cập nhật email và số điện thoại vào Firestore
// //         await userDocRef.update({
// //           email: deliveryPerson.email,
// //           phoneNumber: deliveryPerson.phoneNumber,
// //           avatar: deliveryPerson.avatar,
// //         });

// //         // Cập nhật email trong Firebase Authentication
// //         await user.updateEmail(deliveryPerson.email);

// //         setEditing(false);
// //         Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
// //       }
// //     } catch (error) {
// //       console.error('Lỗi khi cập nhật thông tin:', error);
// //       Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
// //     }
// //      // Chọn ảnh mới từ thư viện hoặc chụp ảnh
// // // Chọn ảnh mới từ thư viện hoặc chụp ảnh
// const handleSave = async () => {
//   try {
//     const user = auth().currentUser;
//     if (user) {
//       const userDocRef = firestore().collection('users').doc(user.uid);

//       // Cập nhật email và số điện thoại vào Firestore
//       await userDocRef.update({
//         email: deliveryPerson.email,
//         phoneNumber: deliveryPerson.phoneNumber,
//         avatar: deliveryPerson.avatar,  // Cập nhật URL ảnh
//       });

//       // Cập nhật email trong Firebase Authentication
//       await user.updateEmail(deliveryPerson.email);

//       setEditing(false);
//       Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
//     }
//   } catch (error) {
//     console.error('Lỗi khi cập nhật thông tin:', error);
//     Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
//   }
// };
//   return (
//     <View style={styles.container}>
//       <View style={styles.avatarContainer}>
//         <Image
//           source={{ uri: 'https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg',}}
//           style={styles.avatar}
//         />
//         {/* <TouchableOpacity style={styles.editIconContainer} onPress={handleChoosePhoto}> */}
//         <TouchableOpacity>
//           <Text style={styles.editIcon}>✏️</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Personal Details Section */}
//       <Text style={styles.heading}>Personal Details</Text>

//         {/* Ô nhập email */}
//       <TextInput
//         style={styles.input}
//         value={deliveryPerson.email}
//         onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, email: text })}
//         placeholder="Địa chỉ email"
//         keyboardType="email-address"
//         editable={false} 
//       />

//       {/* Ô nhập số điện thoại */}
//       <TextInput
//         style={styles.input}
//         value={deliveryPerson.phoneNumber}
//         onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })}
//         placeholder="Số điện thoại"
//         keyboardType="phone-pad"
//         editable={editing} 
//       />

//       {/* Nút Chỉnh sửa/Lưu */}
//       {editing ? ( // Nếu đang chỉnh sửa, hiển thị nút "Lưu"
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveButtonText}>Lưu</Text>
//         </TouchableOpacity>
//       ) : ( // Nếu không chỉnh sửa, hiển thị nút "Chỉnh sửa thông tin"
//         <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
//           <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 150,
//     height: 150,
//     borderRadius: 100,
//     backgroundColor: '#e1e1e1',
//   },
//   editIconContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 120, // Adjust this value as per the alignment of the edit icon
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 5,
//   },
//   editIcon: {
//     fontSize: 16,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   editButton: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PersonalDetailsScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';  // Firebase Auth
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';  // Firebase Storage

const PersonalDetailsScreen = () => {
  const [deliveryPerson, setDeliveryPerson] = useState<{
    avatar: string | null;
    email: string;
    phoneNumber: string;
  }>({
    avatar: null,
    email: '',
    phoneNumber: '',
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          const userDocRef = firestore().collection('users').doc(user.uid);
          const userDocSnap = await userDocRef.get();

          if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            setDeliveryPerson({
              avatar: userData?.avatar || null,
              email: userData?.email || '',
              phoneNumber: userData?.phoneNumber || '',
            });
          } else {
            console.log('Không tìm thấy tài liệu người dùng!');
          }
        } else {
          console.log('Người dùng chưa đăng nhập');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userDocRef = firestore().collection('users').doc(user.uid);

        await userDocRef.update({
          email: deliveryPerson.email,
          phoneNumber: deliveryPerson.phoneNumber,
          avatar: deliveryPerson.avatar,
        });

        await user.updateEmail(deliveryPerson.email);

        setEditing(false);
        Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('Người dùng chưa đăng nhập');
      }
  
      // Mở thư viện ảnh
      const result = await launchImageLibrary({
        mediaType: 'photo',  // hoặc 'video'
        quality: 1,
      });
  
      if (!result.didCancel && result.assets?.[0]) {
        const source = result.assets[0].uri;
        console.log('URI ảnh:', source);
  
        if (source) {
          const reference = storage().ref(`avatars/${user.uid}.jpg`);
          await reference.putFile(source);
  
          const url = await reference.getDownloadURL();
          console.log('URL ảnh: ', url);
  
          setDeliveryPerson((prevState) => ({
            ...prevState,
            avatar: url,
          }));
  
          const userDocRef = firestore().collection('users').doc(user.uid);
          await userDocRef.update({ avatar: url });
        } else {
          Alert.alert('Lỗi', 'Không có ảnh nào được chọn.');
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên Firebase.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: deliveryPerson.avatar || 'https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIconContainer} onPress={handleChoosePhoto}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Personal Details</Text>

      <TextInput
        style={styles.input}
        value={deliveryPerson.email}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, email: text })}
        placeholder="Địa chỉ email"
        keyboardType="email-address"
        editable={false}
      />

      <TextInput
        style={styles.input}
        value={deliveryPerson.phoneNumber}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        editable={editing}
      />

      {editing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalDetailsScreen;

