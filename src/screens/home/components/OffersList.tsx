import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Button, FlatList} from 'react-native';
import OfferItem from '../../../components/OfferItem';
import {collectionNames} from '../../../constants/collectionNames';
import {OfferModel} from '../../../models/OfferModel';
import { ProductModel } from '../../../models/ProductModel';
import { useNavigation } from '@react-navigation/native';
import { Tabbar } from '@bsdaoquang/rncomponent';
import { TextComponent } from '../../../components';
import { fontFamilies } from '../../../constants/fontFamilies';
import { colors } from '../../../constants/colors';

type Props = {};

const OffersList = (props: Props) => {
  const [offers, setOffers] = useState<OfferModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const navigation = useNavigation();

  const time = new Date().getTime();

  useEffect(() => {
    firestore()
      .collection(collectionNames.offers) 
      .where('startAt', '<=', time)
      //.where('endAt', '>=', time)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Offer active not found');
        } else {
          const items: OfferModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });

          setOffers(items);
        }
      });
  }, []);

  return (
    <>
     <Tabbar
        title="Offers"
        tabbarStylesProps={{paddingHorizontal: 0}}
        titleStyleProps={{fontFamily: fontFamilies.poppinsBold, fontSize: 20}}
        renderSeemore={<TextComponent text=" " color={colors.gray2} />}
        onSeeMore={() => {}}
      />
      <FlatList
        style={{paddingLeft: 0}}
        data={offers}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => (
          <OfferItem 
          item={item} 
          key={item.id}
          //@ts-ignore
          onPress={() =>
            //@ts-ignore
            navigation.navigate('ProductsByOfferListScreen', { offerId: item.id })
          } />
        )}      />
    </>


  );

 
};

export default OffersList;