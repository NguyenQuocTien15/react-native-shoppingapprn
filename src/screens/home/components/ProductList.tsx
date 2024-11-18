import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet, Dimensions} from 'react-native';
import {productRef} from '../../../firebase/firebaseConfig';
import {ProductModel} from '../../../models/ProductModel';
import ProductItem from '../../../components/ProductItem';
import {Tabbar} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../../components';
import {fontFamilies} from '../../../constants/fontFamilies';
import {colors} from '../../../constants/colors';

const {width} = Dimensions.get('window'); // Get the screen width
const ITEM_MARGIN = 12; // Margin between items
const NUM_COLUMNS = 2; // Number of columns
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS; // Calculate item width

const ProductList = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    const unsubscribe = productRef.onSnapshot((snapShot: {docs: any[]}) => {
      const productItem = snapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productItem);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}: {item: ProductModel}) => (
    <View style={styles.item}>
      <ProductItem product={item} />
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Tabbar
        title="Product"
        tabbarStylesProps={{paddingHorizontal: 0}}
        titleStyleProps={{fontFamily: fontFamilies.poppinsBold, fontSize: 20}}
        renderSeemore={<TextComponent text="View all" color={colors.gray2} />}
        onSeeMore={() => {}}
      />

      {products.length > 0 && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: ITEM_MARGIN,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: ITEM_MARGIN,
  },
  item: {
    width: ITEM_WIDTH, // Ensure the item's width fits the column
    borderRadius: 12,
    overflow: 'hidden', // Clip the image within the item's boundaries
    backgroundColor: 'white',
  },
});

export default ProductList;
