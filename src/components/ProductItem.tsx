import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {ProductModel} from '../models/ProductModel';
import {globalStyles} from '../styles/globalStyles';
import TextComponent from './TextComponent';
import {sizes} from '../constants/sizes';
import {fontFamilies} from '../constants/fontFamilies';
import {Space} from '@bsdaoquang/rncomponent';
import {colors} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
import PriceWithOffer from './PriceWithOffer';

// Helper function to calculate discounted price
const getDiscountedPrice = (price: number, percent: number) => {
  return price - (price * percent) / 100;
};

type Props = {
  product: ProductModel;
  styles?: StyleProp<ViewStyle>;
  index?: number;
};

const ProductItem = (props: Props) => {
  const {product, styles, index} = props;
  const WIDTH = (sizes.width - 48) / 2;
  const navigation: any = useNavigation();

  // Calculate the offer price if applicable
  const offerPrice = product.offer && product.offer.percent
    ? getDiscountedPrice(product.price, product.offer.percent)
    : product.price;  // Default to product price if no offer

  // Kiểm tra nếu sản phẩm có offer
  const hasOffer = product.offer && product.offer.percent;

  // Đặt một ảnh mặc định nếu imageUrl không hợp lệ
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/220';  // Ảnh placeholder mặc định

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetail', {id: product.id, product: product})}
      style={[
        {
          width: (sizes.width - 48) / 2,
          marginLeft: index ? (index % 2 !== 0 ? 16 : 0) : 0,
          marginBottom: 16,
        },
        styles,
      ]}>
      <Image
        source={{uri: imageUrl}}  // Sử dụng imageUrl đã kiểm tra
        style={{
          flex: 1,
          width: WIDTH,
          height: WIDTH - 20,
          maxWidth: 220,
          maxHeight: 200,
          borderRadius: 12,
          resizeMode: 'cover',
        }}
      />
      <View style={[globalStyles.center]}>
        <Space height={8} />
        <TextComponent
          text={product.title}
          size={18}
          numberOfLine={1}
          font={fontFamilies.poppinsBold}
        />
        <TextComponent
          text={product.type}
          color={colors.gray2}
          numberOfLine={1}
        />
        <TextComponent
          text={`$${product.price}`}
          size={20}
          font={fontFamilies.poppinsSemiBold}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
