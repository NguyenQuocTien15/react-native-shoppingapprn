import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, ProductItem, TextComponent } from '../../components';
import { OfferModel } from '../../models/OfferModel';
import { ProductModel } from '../../models/ProductModel';
import firestore from '@react-native-firebase/firestore';
import { getProductsByOffer } from './getProductsByOffer';
import { Section } from '@bsdaoquang/rncomponent';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../constants/colors';

const OfferProductsList = ({ offerId }: { offerId: string }) => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProductsByOffer(offerId);
      //@ts-ignore
      setProducts(fetchedProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, [offerId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Container back title='Search Results' isScroll={false}>
      {isLoading ? (
        <Section styles={[globalStyles.center, { flex: 1 }]}>
          <ActivityIndicator size={24} color={colors.gray} />
        </Section>
      ) : (
        <Section>
          <FlatList
            numColumns={2}
            ListEmptyComponent={
              <Section styles={[globalStyles.center, { flex: 1 }]}>
                <TextComponent text='No products found' />
              </Section>
            }
            data={products}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => <ProductItem key={item.id} product={item} />}
          />
        </Section>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default OfferProductsList;