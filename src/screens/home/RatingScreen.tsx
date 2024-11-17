// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert } from 'react-native';
// import { Rating } from 'react-native-ratings';
// import { firestore } from './firebaseConfig';

// const RatingScreen: React.FC = () => {
//   const [rating, setRating] = useState<number>(0);

//   const handleRatingPress = (ratingValue: number) => {
//     setRating(ratingValue);
//   };

//   const submitRating = async () => {
//     try {
//       // Giả sử bạn có `userId` và `productId`
//       const userId = "exampleUserId"; // Thay bằng ID người dùng
//       const productId = "exampleProductId"; // Thay bằng ID sản phẩm

//       // Tạo bản ghi đánh giá trên Firebase Firestore
//       await firestore.collection('ratings').add({
//         userId,
//         productId,
//         rating,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//       });

//       Alert.alert('Cảm ơn bạn!', `Bạn đã đánh giá: ${rating} sao.`);
//     } catch (error) {
//       console.error("Error submitting rating: ", error);
//       Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đánh giá.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Đánh giá sản phẩm</Text>
//       <Rating
//         type="star"
//         ratingCount={5}
//         imageSize={40}
//         showRating
//         onFinishRating={handleRatingPress}
//         startingValue={rating}
//       />
//       <Button title="Gửi" onPress={submitRating} disabled={rating === 0} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
// });

// export default RatingScreen;
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const AllReviews = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 35,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'black',
          }}>
          Tất cả đánh giá
        </Text>
      </View>
      <View style={{height:1, width:'100%', backgroundColor:'gray'}}></View>
    </View>
  );
}

export default AllReviews

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },})