import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Button, FlatList} from 'react-native';
import OfferItem from '../../../components/OfferItem';
import {collectionNames} from '../../../constants/collectionNames';
import {OfferModel} from '../../../models/OfferModel';
import { ProductModel } from '../../../models/ProductModel';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const OffersList = (props: Props) => {
  const [offers, setOffers] = useState<OfferModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const navigation = useNavigation();

  const time = new Date().getTime();

  // const fetchProductsByOfferId = async (offerId: string) => {
  //   try {
  //     const snap = await firestore()
  //       .collection("products")
  //       .where('offer', '==', offerId)
  //       .get();

  //     const items: ProductModel[] = [];
  //     snap.forEach(doc => {
  //       items.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       } as ProductModel);
  //     });

  //     setProducts(items);
  //   } catch (error) {
  //     console.error('Error fetching products for offer:', error);
  //   }
  // };

  useEffect(() => {
    firestore()
      .collection(collectionNames.offers) 
      .where('startAt', '<=', time)
     // .where('endAt', '>=', time)
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
      <FlatList
        style={{paddingLeft: 16}}
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