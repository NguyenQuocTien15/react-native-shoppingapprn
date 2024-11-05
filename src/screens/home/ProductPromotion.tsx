import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, ProductItem } from '../../components';
import { OfferModel } from '../../models/OfferModel';
import { ProductModel } from '../../models/ProductModel';
import firestore from '@react-native-firebase/firestore';

type Props = {
    route: {
      params: {
        offer: OfferModel;
      };
    };
  };
const ProductPromotion = ({route}:any) => {
    const {offer} = route.params;
    const [discountedProducts, setDiscountedProducts] = useState<ProductModel[]>([]);
useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('products')
          .where('percent', '==', offer.percent) // Adjust based on your Firestore structure
          .get();

        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductModel[];

        setDiscountedProducts(products);
      } catch (error) {
        console.error("Error fetching discounted products: ", error);
      }
    };

    fetchDiscountedProducts();
  }, [offer.code]);
  return (
    <View style={styles.container}>
    <Text style={styles.header}>{offer.title}</Text>
    <Text style={styles.subHeader}>{offer.percent}% Off with Code: {offer.code}</Text>
    
    <FlatList
      data={discountedProducts}
      keyExtractor={item => item.id}
      renderItem={({item}) => <ProductItem product={item} />}
    />
  </View>
  )
}

export default ProductPromotion;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subHeader: {
      fontSize: 16,
      marginBottom: 16,
    },
  });