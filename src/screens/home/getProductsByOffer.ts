import firestore from '@react-native-firebase/firestore';

export const getProductsByOffer = async (offerId: string) => {
  try {
    const snapshot = await firestore()
      .collection('products')
      .where('offer', '==', offerId)
      .get();

    if (snapshot.empty) {
      console.log(`Không có sản phẩm nào với offerId: ${offerId}`);
      return [];
    }

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return [];
  }
};