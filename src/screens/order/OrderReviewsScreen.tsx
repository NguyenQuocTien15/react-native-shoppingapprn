import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {TextInput} from 'react-native';

const ReviewsProduct = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRating = newRating => {
    setRating(newRating);
    // Save rating to Firestore or update product data
  };
  const handleRatingCompleted = rating => {
    setRating(rating);
    // Lưu rating vào Firestore hoặc xử lý dữ liệu đánh giá
    console.log("User's Rating: ", rating);
  };
  const placeholderComment =
    'Bạn nghĩ như thế nào về kiểu dáng, độ vừa vặn,'+'\n'+'kích thước, màu sắc?';
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
          Đánh giá
        </Text>
      </View>
      <View
        style={{backgroundColor: 'black', height: 200, marginTop: 20}}></View>

      <ScrollView style={{flex: 1}}>
          <AirbnbRating
            count={5}
            reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
            defaultRating={3}
            size={40}
            onFinishRating={rating => console.log('Rating is: ' + rating)}
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
      <TouchableOpacity style={styles.touchCheckOut}>
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
