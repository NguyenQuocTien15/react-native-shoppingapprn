import React, {useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {TextComponent} from '../../components';
import {colors} from '../../constants/colors';
import Avatar from '../../components/Avatar';
import CategoriesList from './components/CategoriesList';
import ArrivalsProduct from './components/ArrivalsProduct';
import OffersList from './components/OffersList';
import ProductList from './components/ProductList';
import {Button, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {Setting4} from 'iconsax-react-native';
import SearchProduct from './components/SearchProduct';
import Entypo from 'react-native-vector-icons/Entypo';
import messaging from '@react-native-firebase/messaging';
import Container from '../../components/Container'; // Assuming you have a Container component
import { Image } from 'react-native';

const HomeScreen = ({navigation}: any) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(message => {
      console.log('New message:', message);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  return (
    <Container isScroll={false}>
      {/* Header Section */}
      <Section styles={styles.header}>
        <Row justifyContent="space-between">
          <Avatar />
          <Image
          source={require('../../assets/images/GoShopLoGo.png')}
         style={{width:150,height:40}}
          />
          <View style={{ position: 'relative' }}>
          <Button
          size='small'
            inline
            icon={<Entypo name="message" size={28} color="white" />}
            color="black"
            onPress={() => navigation.navigate('ChatScreen')}
          />
          <View
          style={{
            borderColor:'red',
            backgroundColor:'red',
            borderRadius:6,
            borderWidth:6,
            width:6,
            height:6,
            top:-1,
            right:-1,
            position:'absolute',
             pointerEvents: 'none'
          }}/>
          </View>
         
        </Row>
      </Section>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Welcome Section */}
        <Section>
          <TextComponent type="title" text="Welcome," size={24} />
          <TextComponent
            text="Our fashion app"
            size={18}
            color={colors.gray2}
          />
        </Section>

        {/* Search Section */}
        <Section>
          <Row>
            <View style={{flex: 1}}>
              <SearchProduct
                onSearchResults={results => {
                  navigation.navigate('SearchResultsScreen', {results});
                }}
              />
            </View>
            <Space width={12} />
            <Button
              styles={styles.searchButton}
              icon={<Setting4 variant="TwoTone" size={24} color="white" />}
              color="black"
              onPress={() => navigation.navigate('FilterScreen')}
            />
          </Row>
        </Section>
        {/* Offers, Arrivals, and Categories */}
        <Space height={1} />
        <OffersList />
        <Space height={16} />
        <ArrivalsProduct />
        <Space height={16} />
        <CategoriesList />
        <Space height={16} />
        <ProductList />
      </ScrollView>
    </Container>
  );
};

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

export default HomeScreen;
