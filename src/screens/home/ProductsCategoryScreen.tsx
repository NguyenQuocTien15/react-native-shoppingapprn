import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { productRef } from '../../firebase/firebaseConfig';
import { ProductModel } from '../../models/ProductModel';
import { fontFamilies } from '../../constants/fontFamilies';
import { colors } from '../../constants/colors';
import { Container, ProductItem, TextComponent } from '../../components';
import { Section } from '@bsdaoquang/rncomponent';
import { globalStyles } from '../../styles/globalStyles';

const ProductsCategoryScreen = ({ route }: any) => {
  const { categoryId,categoryTitle } = route.params; // Get categoryId from navigation params
  console.log(route.params);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading,setIsLoading]=useState(false);

  useEffect(() => {
    productRef.where('categories',  'array-contains', categoryId).onSnapshot(snap => {
      if (snap.empty) {
        console.log('No products found for this category!');
        setProducts([]);
      } else {
        const items: ProductModel[] = [];
        snap.forEach(item => items.push({ id: item.id, ...item.data() } as ProductModel));
        setProducts(items);
      }
    });
  }, [categoryId]);

return <Container  back title={categoryTitle} isScroll={false} >
{
  isLoading ? (
  <Section  styles={[globalStyles.center,{flex:1,}]}>
    <ActivityIndicator size={24} color={colors.gray}/>
  </Section>
  ) : (
    
    <Section>
      <FlatList
    numColumns={2}
    // nếu k có dữ liệu thì
    ListEmptyComponent={
    <Section styles={[globalStyles.center, {flex:1}]}>
      <TextComponent text='Data not found'/>
    </Section>}
     data={products}
     showsVerticalScrollIndicator={false}
     columnWrapperStyle={{justifyContent:'space-between'}}
     renderItem={({item})=><ProductItem navigateTo='ProductDetail' key={item.id} product={item}/>}/>
    </Section>
  )}
</Container>
};

export default ProductsCategoryScreen;
