import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../firebase/firebaseConfig';
import { Rating } from 'react-native-ratings';
import { collection, doc, getDoc, onSnapshot } from '@react-native-firebase/firestore';

const AllReviews = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params; // Get productId from route params

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterOptions = [
    'Đánh giá thấp đến cao', // Low to High Rating
    'Đánh giá gần nhất', // Most Recent
    'Đánh giá cao đến thấp', 'Hủy'
  ];

  const toggleDialog = () => {
    setIsVisible(!isVisible);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsVisible(false); // Close dialog after selection
  };

  // Fetching reviews data
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
       <View style={{alignItems: 'flex-start'}}>
         <Rating
           startingValue={item.rating}
           readonly
           ratingCount={5}
           ratingBackgroundColor="coral"
           imageSize={18}
         />
       </View>

       <Text style={styles.commentText}>{item.comment}</Text>
     </View>
   );

  // Function to apply the selected filter
  const applyFilter = (filter) => {
    let filteredReviews = [...reviews];
    if (filter === 'Đánh giá thấp đến cao') {
      filteredReviews = filteredReviews.sort((a, b) => a.rating - b.rating); // Low to High Rating
    } else if (filter === 'Đánh giá cao đến thấp') {
      filteredReviews = filteredReviews.sort((a, b) => b.rating - a.rating); // High to Low Rating
    } else if (filter === 'Đánh giá gần nhất') {
      filteredReviews = filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most Recent
    }else if (filter === 'Đánh giá gần nhất') {
      setIsVisible(false)
    }
    setReviews(filteredReviews); // Update the reviews list
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Tất cả đánh giá</Text>

        <TouchableOpacity onPress={toggleDialog}>
          <Ionicons name="filter-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {isVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={toggleDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dialogContainer}>
              <FlatList
                data={filterOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.filterOption}
                    onPress={() => {
                      handleFilterSelect(item);
                      applyFilter(item); // Apply the filter when selected
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </Modal>
      )}

      {selectedFilter && (
        <Text style={styles.selectedFilterText}>
          Bạn chọn: {selectedFilter}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <RenderReviewItem item={item} />}
          keyExtractor={item => item.id || Math.random().toString()}
        />
      ) : (
        <Text style={styles.noReviewsText}>Chưa có đánh giá cho sản phẩm này.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  reviewContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  commentText: {
    fontSize: 14,
    marginVertical: 5,
  },
  noReviewsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedFilterText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default AllReviews;
