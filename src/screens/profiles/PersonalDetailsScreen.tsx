import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
//import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateEmail } from 'firebase/auth'; // Import hàm updateEmail

const PersonalDetailsScreen = () => {
  const [deliveryPerson, setDeliveryPerson] = useState({
    avatar: null,
    email: '',
    phoneNumber: '',
  });
  const [editing, setEditing] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);

  useEffect(() => {
    const fetchDeliveryPersonData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'shippers', user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setDeliveryPerson({
              avatar: userDocSnap.data().avatar || null,
              email: userDocSnap.data().email || '',
              phoneNumber: userDocSnap.data().phoneNumber || '',
            });
          } else {
            console.log('Không tìm thấy tài liệu!');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu shipper:', error);
      }
    };

    fetchDeliveryPersonData();
  }, []);

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'shippers', user.uid);
  
        // Cập nhật email và số điện thoại
        await updateDoc(userDocRef, {
          email: deliveryPerson.email, 
          phoneNumber: deliveryPerson.phoneNumber,
        });
  
        setEditing(false);
              Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
              // Cập nhật email trên Firebase Authentication
              await updateEmail(user, deliveryPerson.email); 
      
              setEditing(false);
              Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: 'https://example.com/avatar.jpg'}}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
      {/* Personal Details Section */}
      <Text style={styles.heading}>Personal Details</Text>

        {/* Ô nhập email */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.email}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, email: text })}
        placeholder="Địa chỉ email"
        keyboardType="email-address"
        editable={false} 
      />

      {/* Ô nhập số điện thoại */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.phoneNumber}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        editable={editing} 
      />

      {/* Nút Chỉnh sửa/Lưu */}
      {editing ? ( // Nếu đang chỉnh sửa, hiển thị nút "Lưu"
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      ) : ( // Nếu không chỉnh sửa, hiển thị nút "Chỉnh sửa thông tin"
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
    right: 120, // Adjust this value as per the alignment of the edit icon
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


export default PersonalDetailsScreen



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// const PersonalDetailsScreen = () => {
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const auth = getAuth();
//   const storage = getStorage();

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const handleSave = async () => {
//     const currentUser = auth.currentUser; // Declare currentUser here

//     if (!currentUser) {
//       Alert.alert("You must be logged in to update your profile.");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (image) {
//         const imageRef = ref(storage, `users/${currentUser.uid}/profile.jpg`);
//         const response = await fetch(image);
//         const blob = await response.blob();
//         await uploadBytes(imageRef, blob);
//         const imageUrl = await getDownloadURL(imageRef);
//         await updateProfile(currentUser, { photoURL: imageUrl });
//       }

//       if (currentUser.email !== email) {
//         await updateEmail(currentUser, email);
//       }

//       Alert.alert('Profile updated successfully!');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       Alert.alert('Error updating profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.avatarContainer}>
//         <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
//           {image ? (
//             <Image source={{ uri: image }} style={styles.avatar} />
//           ) : (
//             <Image
//               source={{ uri: auth.currentUser?.photoURL || 'https://example.com/avatar.jpg' }} 
//               style={styles.avatar}
//             />
//           )}
//           <Text style={styles.editIcon}>✏️</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.heading}>Personal Details</Text>

//       <TextInput
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email Address"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         placeholder="Phone number"
//         keyboardType="phone-pad"
//       />

//       <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// };


// export default PersonalDetailsScreen;

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
//     right: 120,
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
// });


