import {Button, Row} from '@bsdaoquang/rncomponent';
import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {sizes} from '../constants/sizes';
import {OfferModel} from '../models/OfferModel';
import TextComponent from './TextComponent';
import { useNavigation } from '@react-navigation/native';
import { linkProductToOffer } from '../firebase/linkProductToOffer';

type OfferItemProps  = {
  item: OfferModel;
  onPress: () => void; // Nhận hàm `onPress` từ OffersList


};

const OfferItem = ({ item,onPress}: OfferItemProps) => {
  
 const navigation = useNavigation();

  // const testLinking = async () => {
  //   const productId = "BZlSBinauOn5tIHBMgH2"; // Thay thế bằng ID sản phẩm thật
  //   const offerId = item.id; // Sử dụng offer.id từ props
  //   const success = await linkProductToOffer(productId, offerId);

  //   if (success) {
  //     console.log('Liên kết thành công!');
  //     // Sau khi liên kết thành công, điều hướng đến màn hình chi tiết sản phẩm hoặc trang khác
  //     navigation.navigate('OfferProductsList', { productId });
  //   } else {
  //     console.log('Liên kết thất bại.');
  //   }
  // }; 

  const renderOfferChildren = () => (
    <>
      <TextComponent
        type="title"
        size={28}
        font={fontFamilies.poppinsBold}
        text={`${item.percent}% Off`}
      />
      <TextComponent text={item.title} color={colors.dark} size={16} />
      <TextComponent
        text={`With code: ${item.code}`}
        size={16}
        styles={{paddingVertical: 12}}
      />
      <Row justifyContent="flex-start">
       
        <Button
          size="small"
          title="Get Now"
          styles={{paddingHorizontal: 20, marginTop:25}}
          color={colors.dark}
          onPress={() => {}}
        />
      </Row>
    </>
  );

  return item.imageUrl ? (
    <ImageBackground
      source={{uri: item.imageUrl}}
      style={localstyles.container}
      imageStyle={{flex: 1, resizeMode: 'cover', borderRadius: 20}}>
      {renderOfferChildren()}
    </ImageBackground>
  ) : (
    <View style={localstyles.container}>{renderOfferChildren()}</View>
  );
};

export default OfferItem;

const localstyles = StyleSheet.create({
  container: {
    width: sizes.width * 0.7,
    minHeight: 180,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
