import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProductModel } from '../../models/ProductModel';
import { Container, ProductItem, TextComponent } from '../../components';
import {Section } from '@bsdaoquang/rncomponent';
import {colors} from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import firestore from '@react-native-firebase/firestore'
const ResultScreen = ({navigation,route}:any) => {
  const {
    filterValues,
  }: {
  filterValues : {
    categories: string[];
    price: {
      low: number;
      high: number;
    };
    sortby: string;
    rate: number;
  };
  } = route.params;

  const [isLoading,setIsLoading]=useState(false);
  //ds tìm thấy được- lưu trong mảng
  const[products,setProducts]=useState<ProductModel[]>([]);
console.log(filterValues)
  //hàm useEffect được gọi lại khi mà filterValue có sự thay đổi
  useEffect(() => {
    getProducts();
  }, [filterValues]);

  //hàm lọc Product - lấy hết sp ra
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const snap = await firestore()
      .collection('products')
      .where('categories','array-contains-any',filterValues.categories)
       .where('price', '>=',filterValues.price.low)
       .where('price', '<',filterValues.price.high)
       .where('rate', '>=', filterValues.rate) // Lọc theo rating
      .get()
      if (!snap.empty) {
        const items:ProductModel[]=[]
        snap.forEach((item:any)=>{
          items.push({
            id: item.id,
            ...item.data()
          })
        });
        setProducts(items); // Đặt dữ liệu cho products
      }else{
        setProducts([]); // Trường hợp không có dữ liệu
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  return <Container  back title='Results' isScroll={false}>
    {
      isLoading ? (
      <Section styles={[globalStyles.center,{flex:1,}]}>
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
         renderItem={({item})=><ProductItem key={item.id} product={item}/>}/>
        </Section>
      )}
  </Container>
}

export default ResultScreen