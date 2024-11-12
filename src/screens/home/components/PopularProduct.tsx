import {Card, Col, Row, Space, Tabbar} from '@bsdaoquang/rncomponent';
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextComponent} from '../../../components';
import {colors} from '../../../constants/colors';
import {fontFamilies} from '../../../constants/fontFamilies';
import {productRef} from '../../../firebase/firebaseConfig';
import {ProductModel} from '../../../models/ProductModel';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
type Props = {};

const PopularProduct = (props: Props) => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  const navigation: any = useNavigation();

  // useEffect(() => {
  //   productRef
  //     .orderBy('rate')
  //     .limit(5)
  //     .onSnapshot(snap => {
  //       if (snap.empty) {
  //         console.log(`Products not found!`);
  //       } else {
  //         const items: ProductModel[] = [];
  //         snap.forEach((item: any) =>
  //           items.push({
  //             id: item.id,
  //             ...item.data(),
  //           }),
  //         );

  //         setProducts(items);
  //       }
  //     });
  // }, []);


  useEffect(() => {
    productRef
      .orderBy('rate')
      .limit(5)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log(`Products not found!`);
        } else {
          const items: ProductModel[] = [];
          snap.forEach((item: any) =>
            items.push({
              id: item.id,
              ...item.data(),
            }),
          );

          setProducts(items);
        }
      });
  }, []);
  //HÀM UPDATE price từ kiểu string sang int
// const handleUpdateProduct = async () => {
// products.forEach(async item => {
// await firestore()
// .collection('products')
// .doc(item.id)
// .update({price: Math.floor(Math.random() * 500)}) //price random số ngẫu nhiên
// })
// };

//
const handleUpdateProduct = () => {
  products.forEach (async item => {
await firestore()
.collection('products')
.doc(item.id)
.update({seller: Math.floor(Math.random()*100)})
  });
};
  return (
    <View style={{flex: 1}}>
      <Tabbar
        title="Popular Products"
        tabbarStylesProps={{paddingHorizontal: 16}}
        titleStyleProps={{fontFamily: fontFamilies.poppinsBold, fontSize: 20}}
        renderSeemore={<TextComponent text="View all" color={colors.gray2} />}
        // onSeeMore={() => handleUpdateProduct()}
        onSeeMore={() => {}}
      />

      {products.length > 0 &&
        products.map(item => (
          <Card
            key={item.id}
            onPress={() => navigation.navigate('ProductDetail', {id: item.id})}>
            <Row>
              <Image
                source={{uri: item.imageUrl}}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 8,
                }}
              />
              <Col styles={{paddingHorizontal: 12}}>
                <TextComponent
                numberOfLine={1}
                  text={item.title}
                  font={fontFamilies.poppinsBold}
                  size={16}
                />
                <TextComponent
                  text={item.type}
                  color={colors.gray2}
                  styles={{paddingVertical: 4}}
                />
                <Row justifyContent="flex-start">
                  <AntDesign name="star" color={colors.success} size={18} />
                  <Space width={8} />
                  <TextComponent text={`(${item.averageRating})`} />
                </Row>
              </Col>
              <TextComponent
                text={`$${item.price}`}
                font={fontFamilies.poppinsSemiBold}
                size={18}
              />
            </Row>
          </Card>
        ))}
    </View>
  );
};

export default PopularProduct;
