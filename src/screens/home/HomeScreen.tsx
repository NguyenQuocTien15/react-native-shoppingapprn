import {Button, Input, Row, Section, Space} from '@bsdaoquang/rncomponent';
import messaging from '@react-native-firebase/messaging';
import {HambergerMenu, SearchNormal1, Setting4} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Container, TextComponent} from '../../components';
import Avatar from '../../components/Avatar';
import {colors} from '../../constants/colors';
import Avatar from '../../components/Avatar';
import CategoriesList from './components/CategoriesList';
import ArrivalsProduct from './components/ArrivalsProduct';
import OffersList from './components/OffersList';
import ProductList from './components/ProductList';
import {Button, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {ProductModel} from '../../models/ProductModel';
import SearchProduct from './components/SearchProduct';
import {Setting4} from 'iconsax-react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const HomeScreen = ({navigation}: any) => {
  const ListHeader = () => (
    <View style={{padding:15}}>
      
        <Row justifyContent="flex-end">
          <Avatar />
          
        </Row>
     
      <Space height={16} />
      <TextComponent type="title" text="Welcome," size={24} />
      <TextComponent text="Our fashion app" size={18} color={colors.gray2} />

      <Section>
        <Row>
          <View style={{flex: 1}}>
            {/* @ts-ignore */}
            <SearchProduct
              onSearchResults={results => {
                handleSearchResults(results); // Gọi hàm để xử lý kết quả tìm kiếm
                navigation.navigate('SearchResultsScreen', {results}); // Điều hướng sang màn hình SearchResultsScreen
              }}
              navigation={undefined}
            />
          </View>

          <Space width={12} />
          <Button
            styles={{width: 48, height: 48}}
            icon={<Setting4 variant="TwoTone" size={24} color="white" />}
            color="black"
            onPress={() => {}}
          />
        </Row>
      </Section>

      <OffersList />
      <Space height={16} />
      <ArrivalsProduct />
      <Space height={16} />
      <CategoriesList />
      <Space height={16} />
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={<ListHeader />}
      data={[]} // Empty data since we only want the header and child components
      renderItem={null} // No items to render; header is the focus
      ListFooterComponent={<ProductList />} // Render ProductList in the footer
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};
//@ts-ignore

const styles = StyleSheet.create({
  header: {
    padding: 10,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  searchButton: {
    width: 48,
    height: 48,
  },
});
const SearchResults: React.FC<{products: ProductModel[]}> = ({products}) => (
  <View>
    {products.map(product => (
      <View key={product.id} style={{padding: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{product.title}</Text>
        <Text style={{color: colors.gray2}}>{product.description}</Text>
      </View>
    ))}
  </View>
);

export default HomeScreen;
