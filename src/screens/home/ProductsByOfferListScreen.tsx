import { View, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, ProductItem, TextComponent } from '../../components';
import { ProductModel } from '../../models/ProductModel';
import { getProductsByOffer } from './getProductsByOffer';
import { Section } from '@bsdaoquang/rncomponent';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../constants/colors';
import { useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = {
  ProductsByOfferListScreen: {
    offerId: string;
  };
};

const ProductsByOfferListScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'ProductsByOfferListScreen'>>();
  const { offerId } = route.params ?? {}; // Sử dụng optional chaining để xử lý undefined

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!offerId) {
      console.warn('No offerId provided');
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsByOffer(offerId);
        //@ts-ignore
        setProducts(fetchedProducts || []); // Đảm bảo fetchedProducts luôn là mảng
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [offerId]);

  if (isLoading) {
    return (
      <Section styles={[globalStyles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" color={colors.gray} />
      </Section>
    );
  }

  return (
    <Container back title="Your Offer" isScroll={false}>
      <Section>
        <FlatList
          numColumns={2}
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={
            <Section styles={[globalStyles.center, { flex: 1 }]}>
              <TextComponent text="No products found" />
            </Section>
          }
          renderItem={({ item, index }) => (
            <ProductItem
              navigateTo="ProductDetail"
              key={item.id}
              product={item}
              index={index}
            />
          )}
        />
      </Section>
    </Container>
  );
};

export default ProductsByOfferListScreen;
