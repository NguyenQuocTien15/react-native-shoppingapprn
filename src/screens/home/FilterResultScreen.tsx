import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProductModel } from '../../models/ProductModel';
import { Container, ProductItem, TextComponent } from '../../components';
import {Section } from '@bsdaoquang/rncomponent';
import {colors} from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const FilterResultScreen = ({navigation,route}:any) => {
  const {
    filterValues,
  }: {
  filterValues : {
    categories: string[];
    brand: string[];
    price: {
      low: number;
      high: number;
    };
    // sortby: string;
    // rate: number;
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
      // Bắt đầu với query cơ bản từ collection 'products'
      let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection('products');

  
      // Lọc theo danh mục nếu có
      if (filterValues.categories?.length > 0) {
        query = query.where('categories', 'array-contains-any', filterValues.categories);
      }
  // Lọc theo thương hiệu nếu có
  if (filterValues.brand?.length > 0 && filterValues.brand.length <= 10) {
    query = query.where('brands', 'in', filterValues.brand);
  }
      // Lọc theo khoảng giá nếu có giá trị
      if (filterValues.price) {
        if (filterValues.price.low !== undefined) {
          query = query.where('price', '>=', filterValues.price.low);
        }
        if (filterValues.price.high !== undefined) {
          query = query.where('price', '<', filterValues.price.high);
        }
      }
  //hh
      // // Lọc theo rating nếu có
      // if (filterValues.rate !== undefined) {
      //   query = query.where('rate', '==', filterValues.rate);
      // }
  
      // Thực hiện truy vấn
      const snap = await query.get();
  
      // Xử lý kết quả trả về
      if (!snap.empty) {
        const items: ProductModel[] = [];
        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data()
          });
        });
        setProducts(items); // Cập nhật dữ liệu vào state
      } else {
        setProducts([]); // Không có sản phẩm nào khớp với bộ lọc
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái tải
    }
  };
  
  
  return <Container  back bigTitle='Results' isScroll={false}>
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
         renderItem={({item})=><ProductItem navigateTo='ProductDetail' key={item.id} product={item}/>}/>
        </Section>
      )}
  </Container>
}

export default FilterResultScreen

