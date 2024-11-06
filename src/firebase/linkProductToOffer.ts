import firestore from '@react-native-firebase/firestore';

export const linkProductToOffer = async (productId: string, offerId: string): Promise<boolean> => {
  try {
    const productRef = firestore().collection('products').doc(productId);
    
    // Update the discount_id field
    await productRef.update({ discount_id: offerId });
    console.log('Product linked to offer ID:', offerId);
    
    // Verify by reading back the updated document
    const updatedProduct = await productRef.get();
    if (updatedProduct.exists && updatedProduct.data()?.discount_id === offerId) {
      console.log('Verification successful: discount_id updated correctly.');
      return true; // Indicating success
    } else {
      console.warn('Verification failed: discount_id not updated.');
      return false; // Indicating verification failure
    }
  } catch (error) {
    console.error("Error linking product to offer: ", error);
    return false; // Indicating failure due to error
  }
};

export const linkProductsToMultipleOffers = async (offerIds: string[]) => {
  try {
    const productsSnapshot = await firestore().collection('products').get();

    if (productsSnapshot.empty) {
      console.log('No products found');
      return;
    }

    const batch = firestore().batch(); // Tạo batch để cập nhật nhiều sản phẩm

    productsSnapshot.forEach(doc => {
      const productRef = firestore().collection('products').doc(doc.id);
      // Cập nhật trường offer_ids với mảng các offerIds
      batch.update(productRef, {
        offer_ids: firestore.FieldValue.arrayUnion(...offerIds), // Thêm các offerId vào mảng
      });
    });

    // Commit batch
    await batch.commit();
    console.log('All products have been linked with the offers successfully');
  } catch (error) {
    console.error('Error linking products with offers:', error);
  }
};

export const linkMultipleProductsToOffer = async (offerId: string, productIds: string[]): Promise<void> => {
    try {
      const results = await Promise.all(
        productIds.map(async (productId) => {
          const success = await linkProductToOffer(productId, offerId);
          if (success) {
            console.log(`Successfully linked product ${productId} to offer ${offerId}`);
          } else {
            console.warn(`Failed to link product ${productId} to offer ${offerId}`);
          }
          return success;
        })
      );
  
      const successCount = results.filter((res) => res).length;
      console.log(`Linked ${successCount} out of ${productIds.length} products to offer ${offerId}`);
    } catch (error) {
      console.error("Error linking multiple products to offer:", error);
    }
  };
  