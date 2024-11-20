import {
  View,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { ProductModel } from '../models/ProductModel';
import { globalStyles } from '../styles/globalStyles';
import TextComponent from './TextComponent';
import { sizes } from '../constants/sizes';
import { fontFamilies } from '../constants/fontFamilies';
import { Space } from '@bsdaoquang/rncomponent';
import { colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

// Calculate the discounted price
const getDiscountedPrice = (price: number, percent: number) => {
  return price - (price * percent) / 100;
};

type Props = {
  product: ProductModel;
  styles?: StyleProp<ViewStyle>;
  index?: number;
  navigateTo: 'ProductDetail' | 'ProductsByOfferListScreen';
};

const ProductItem = (props: Props) => {
  const { product, styles, index, navigateTo } = props;
  const WIDTH = (sizes.width - 48) / 2;
  const navigation: any = useNavigation();

  const offerPrice = product.offer?.percent
    ? getDiscountedPrice(product.price, product.offer.percent)
    : product.price;

  const hasOffer = !!product.offer?.percent;
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/220';

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', {id: product.id, product: product})
      }
      style={[
        {
          width: (sizes.width - 50) / 2,
          marginLeft: index ? (index % 2 !== 0 ? 16 : 0) : 0,
          marginBottom: 16,
          justifyContent: 'center',
        },
        styles,
      ]}>
      <Image
        source={{uri: imageUrl}} // Sử dụng imageUrl đã kiểm tra
        style={{
          width: 180, // Đảm bảo chiều rộng của ảnh bằng chiều rộng cột
          height: 200, // Đặt chiều cao bằng chiều rộng để giữ tỷ lệ vuông
          borderRadius: 12, // Bo góc cho hình ảnh
          resizeMode: 'cover', // Đảm bảo hình ảnh hiển thị đầy đủ cột
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

        <>
          {product.offer?.percent ? (
            <>
              <TextComponent
                text={`$${product.price}`} // Giá gốc
                styles={{
                  textDecorationLine: 'line-through',
                  color: colors.black,
                }}
              />
              <TextComponent
                text={`$${offerPrice}`} // Giá khuyến mãi
                styles={{color: colors.gray2}}
              />
            </>
          ) : (
            <TextComponent
              color={colors.red}
              font={fontFamilies.poppinsBold}
              text={`$${product.price}`}
            />
          )}
        </>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
