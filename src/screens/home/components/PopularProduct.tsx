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

type Props = {};

const PopularProduct = (props: Props) => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  const navigation: any = useNavigation();

  useEffect(() => {
    const currentTime = new Date().getTime();

    const unsubscribe = productRef
      .orderBy('averageRating', 'desc')
      .limit(5)
      .onSnapshot(
        snap => {
          if (!snap || snap.empty) {
            console.log(`Products not found!`);
            setProducts([]);
          } else {
            const items: ProductModel[] = [];
            snap.forEach((item: any) => {
              const data = item.data();

              // Kiểm tra sản phẩm không có khuyến mãi hoặc khuyến mãi đã hết hạn
              if (!data.offer || (data.offer.endAt && data.offer.endAt < currentTime)) {
                items.push({
                  id: item.id,
                  ...data,
                });
              }
            });

            setProducts(items);
          }
        },
        error => {
          console.error("Error fetching popular products:", error);
        }
      );

    return () => unsubscribe();
  }, []);

const handleUpdateProduct = () => {
  products.forEach (async item => {
    //@ts-ignore
await firestore()
.collection('products')
.doc(item.id)
.update({selled: Math.floor(Math.random()*100)})
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