import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {TextInput} from 'react-native';
import {Col, Row, Space} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../components';
import {getAuth} from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';
//@ts-ignore
const ReviewsProduct = ({navigation}) => {
  const route = useRoute();
  //@ts-ignore
  const {productId, title, imageUrl, size, color} = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const placeholderComment =
    'Bạn nghĩ như thế nào về kiểu dáng, độ vừa vặn,' +
    '\n' +
    'kích thước, màu sắc?';

  const userId = getAuth().currentUser?.uid;

  // const handleReviewProduct = async () => {
  //   if (rating === 0 && comment.trim() === '') {
  //     Alert.alert('Vui lòng chọn đánh giá và viết bình luận');
  //     return;
  //   }
  //   try {
  //     if (!userId) {
  //       Alert.alert('Bạn cần đăng nhập để đánh giá và viết bình luận');
  //     }
  //     const productId = route.params.productId;
  //     const reviewRef = doc(
  //       collection(getFirestore(), 'reviews', productId, 'productReviews'),
  //     );
  //     await setDoc(reviewRef, {
  //       productId: productId,
  //       userId: userId,
  //       rating: rating,
  //       color:color,
  //       size:size,
  //       comment: comment,
  //       created_at: serverTimestamp(),
  //     });

  //     Alert.alert('Cảm ơn bạn đã đánh giá sản phẩm!');
  //     // Optionally, navigate back or reset fields
  //     navigation.goBack();
  //   } catch (error) {
  //     console.error('Error submitting review:', error);
  //     Alert.alert('Có lỗi xảy ra, vui lòng thử lại!');
  //   }
  // };
 
 const handleReviewProduct = async () => {
   if (rating === 0 || comment.trim() === '') {
     Alert.alert('Vui lòng chọn đánh giá và viết bình luận');
     return;
   }
   try {
     if (!userId) {
       Alert.alert('Bạn cần đăng nhập để đánh giá và viết bình luận');
       return;
     }

     // Get the productId from route params
     //@ts-ignore

     const productId = route.params.productId;

     // Create a reference to the Firestore document path: reviews -> productId -> reviewId
     const reviewRef = doc(
       collection(getFirestore(), 'reviews', productId, 'reviews'),
     );

     // Save the review data in Firestore under the specific product
     await setDoc(reviewRef, {
       productId: productId, // Save productId
       userId: userId,
       rating: rating,
       comment: comment,
       created_at: serverTimestamp(),
     });

     Alert.alert('Cảm ơn bạn đã đánh giá sản phẩm!');
     // Optionally, navigate back or reset fields
     navigation.goBack();
   } catch (error) {
     console.error('Error submitting review:', error);
     Alert.alert('Có lỗi xảy ra, vui lòng thử lại!');
   }
 };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
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
          Đánh giá
        </Text>
      </View>
      <View
        style={{backgroundColor: '#adb5bd', borderRadius: 12, marginTop: 10}}>
        <Row alignItems="flex-start" styles={{margin: 10}}>
          <Image
            source={{uri: imageUrl}}
            style={{
              width: 110,
              height: 110,
              borderRadius: 12,
              resizeMode: 'cover',
            }}
          />
          <Space width={12} />
          <Col>
            <TextComponent
              type="title"
              numberOfLine={1}
              //@ts-ignore
              ellipsizeMode="tail"
              text={title}
              size={20}
            />

            <TextComponent text={`${color} - ${size}`} size={17} />
          </Col>
        </Row>
      </View>

      <ScrollView style={{flex: 1}}>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
          defaultRating={0}
          size={40}
          onFinishRating={selectedRating => setRating(selectedRating)}
        />
        <Text style={[styles.label, {textAlign: 'center'}]}>
          Đánh giá sản phẩm này
        </Text>
        <Text style={[styles.label]}>Viết đánh giá</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholderComment}
          value={comment}
          onChangeText={text => setComment(text)}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.touchCheckOut}
        onPress={handleReviewProduct}>
        <Text style={styles.textCheckOut}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewsProduct;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  touchCheckOut: {
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ff7891',
  },
  textCheckOut: {
    color: 'white',
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#F6F7FB',
    height: 70,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});
