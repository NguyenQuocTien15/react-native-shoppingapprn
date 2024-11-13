import {Button, Input, Row, Section, Space} from '@bsdaoquang/rncomponent';
import messaging from '@react-native-firebase/messaging';
import {HambergerMenu, SearchNormal1, Setting4} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Container, TextComponent} from '../../components';
 import Avatar from '../../components/Avatar';
 import {colors} from '../../constants/colors';
import ArrivalsProduct from './components/ArrivalsProduct';
import CategoriesList from './components/CategoriesList';
 import OffersList from './components/OffersList';
 import PopularProduct from './components/PopularProduct';
 import SearchProduct from './components/SearchProduct';
import {useStatusBar} from '../../utils/useStatusBar';
import FilterScreen from './FilterScreen';
import Entypo from 'react-native-vector-icons/Entypo';

const HomeScreen = ({navigation}:any) => {
  useEffect(() => {
    messaging().onMessage(mess => {
      console.log(mess);
    });
  }, []);

 useStatusBar('dark-content');

  return (
    <Container isScroll={false}>
      <Section styles={{paddingTop: 16, marginTop:16}}>
        <Row justifyContent="flex-end">
        <Avatar />
        </Row>
      </Section>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <>
          <Section>
            <TextComponent type="title" text="Welcome," size={24} />
            <TextComponent
              text="Our fashion app"
              size={18}
              color={colors.gray2}
            />
          </Section>
          <Section>
            <Row>
            <View style={{ flex: 1 }}>
            {/* @ts-ignore */}
              <SearchProduct onSearchResults={(results) => {
                  handleSearchResults(results); // Gọi hàm để xử lý kết quả tìm kiếm
                  navigation.navigate('SearchResultsScreen', { results }); // Điều hướng sang màn hình SearchResultsScreen
                } } navigation={undefined}  />
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
        </>
        <OffersList />
        <Space height={20} />
        <CategoriesList />
        <Space height={20} />
        <ArrivalsProduct />
        <Space height={20} />
        <PopularProduct />
      </ScrollView>
    </Container>
  );
};

const SearchResults: React.FC<{ products: ProductModel[] }> = ({ products }) => (
  <View>
    {products.map((product) => (
      <View key={product.id} style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{product.title}</Text>
        <Text style={{ color: colors.gray2 }}>{product.description}</Text>
      </View>
    ))}
  </View>
);

export default HomeScreen;
