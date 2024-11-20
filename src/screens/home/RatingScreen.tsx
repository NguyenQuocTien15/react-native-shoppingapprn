import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {db, dbFirestore, reviewsRef} from '../../firebase/firebaseConfig';
import {Alert} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import { AirbnbRating } from 'react-native-elements';
import { Rating } from 'react-native-ratings';

const AllReviews = ({item}) => {
  const route = useRoute();

  const navigation = useNavigation();
  const {productId} = route.params; // Get productId from route params
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the reviews collection for the specific product
    const reviewsRef = collection(db, 'reviews', productId, 'reviews');

    // Real-time listener for reviews
    const unsubscribe = onSnapshot(
      reviewsRef,
      async snapshot => {
        try {
          const reviewsData = snapshot.docs.map(doc => ({
            id: doc.id, // Review ID
            ...doc.data(), // Review data
          }));

          // Gắn userName cho từng đánh giá
          const reviewsWithUserNames = await Promise.all(
            reviewsData.map(async review => {
              const userName = review.userId
                ? await fetchUserName(review.userId)
                : 'Unknown'; // Nếu không có userId, gắn "Unknown"
              return {...review, userName}; // Thêm userName vào dữ liệu review
            }),
          );

          setReviews(reviewsWithUserNames); // Cập nhật danh sách đánh giá
          setLoading(false); // Dừng trạng thái loading
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setLoading(false);
        }
      },
      error => {
        console.error('Error fetching reviews: ', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [productId]);


  const fetchUserName = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists) {
        return userDoc.data().displayName; // Trả về userName
      }
    } catch (error) {
      console.error('Error fetching userName:', error);
    }
    return 'Unknown'; // Nếu không tìm thấy, trả về "Unknown"
  };
  const RenderReviewItem = ({item}) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.userText}>{item.userName}</Text>
      <View style={{alignItems: 'flex-start'}}><Rating
        startingValue={item.rating}
        readonly
        ratingCount={5}
        ratingBackgroundColor="coral"
        imageSize={18}
      /></View>
      
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          marginBottom: 10,
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : reviews.length > 0 ? (
        <FlatList
          data={reviews} // Ensure reviewsData is an array of objects with userId
          renderItem={({item}) => <RenderReviewItem item={item} />}
          keyExtractor={item => item.id || Math.random().toString()}
        />
      ) : (
        <Text style={styles.noReviewsText}>
          No reviews yet for this product.
        </Text>
      )}
    </View>
  );
};

export default AllReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    marginVertical: 5,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  noReviewsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
