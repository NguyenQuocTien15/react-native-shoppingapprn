import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, TextComponent } from '../../components';
import { SearchNormal, TickCircle } from 'iconsax-react-native';
import {
  Button,
  Col,
  colors,
  globalStyles,
  Row,
  Section,
  Space,
  Tabbar,
} from '@bsdaoquang/rncomponent';
import { fontFamilies } from '../../constants/fontFamilies';
import { CategoryModel } from '../../models/CategoryModel';
import firestore from '@react-native-firebase/firestore';
import { ProductModel } from '../../models/ProductModel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BrandModel } from '../../models/BrandModel';
import RnRangeSlider from 'rn-range-slider'

const FilterScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  //const [sortBySelected, setSortBySelected] = useState('today');
  const [brands, setBrands] = useState<BrandModel[]>([]);
const [brandsSelected, setBrandsSelected] = useState<string[]>([]);

  const [rateSelected, setRateSelected] = useState(2);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<{
    categories: string[];
    brands: string[];
    price: {
      low: number;
      high: number;
    };
   // sortby: string;
   // rate: number;
  }>({
    categories: [],
    brands: [],
    price: {
      low: 0,
      high: 1000,
    },
  //  sortby: 'today',
    //rate: 5,
  });

  // const sortByValues = [
  //   { key: 'today', title: 'New Today' },
  //   { key: 'thisweek', title: 'New This Week' },
  //   { key: 'bestseller', title: 'Best Seller' },
  // ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getBrands(); 
      await getCategories();
      await handleGetMaxPrice();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getBrands = async () => {
    const snap = await firestore().collection('brands').get();
    if (!snap.empty) {
      const items: BrandModel[] = [];
      snap.forEach((item: any) => items.push({ id: item.id, ...item.data() }));
      //mặc định chọn trường đầu tiên
      handleSelectedBrand(items[0].id);
      setBrands(items);
    }
  };
  const handleSelectedBrand = (id: string) => {
    const items = [...brandsSelected];
    const index = items.findIndex((element) => element === id);
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }
   setBrandsSelected(items);
  };
  
  const getCategories = async () => {
    const snap = await firestore().collection('categories').get();
    if (!snap.empty) {
      const items: CategoryModel[] = [];
      snap.forEach((item: any) => items.push({ id: item.id, ...item.data() }));
      //mặc định chọn trường đầu tiên
      handleSelectedCategory(items[0].id);
      setCategories(items);
    }

    
  };

  const handleSelectedCategory = (id: string) => {
    const items = [...categoriesSelected]
    const index = items.findIndex((element) => element === id);
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }
   setCategoriesSelected(items);
  };

  const handleGetMaxPrice = async () => {
    const snap = await firestore()
      .collection('products')
      .orderBy('price')
      .limitToLast(1)
      .get();

    if (!snap.empty) {
      const items: ProductModel[] = [];
      snap.forEach((item: any) => {
        items.push({ ...item.data() });
      });
      //@ts-ignore
      items.length > 0 && setMaxPrice(items[0].price);
            //@ts-ignore
      setFilterValues({ ...filterValues, price: { low: 0, high: items[0].price } });
    }
  };

  return isLoading ? (
    <Section>
      <ActivityIndicator />
    </Section>
  ) : (
    <Container
    //@ts-ignore
      bottomComponent={
        <Section>
          <Button
            inline
            title="Apply Now"
            onPress={() => navigation.navigate('FilterResultScreen',{filterValues: {...filterValues, categories: categoriesSelected, brands: brandsSelected}})}
            color={colors.black}
          />
        </Section>
      }
    >
      <Section>
        <Row
          styles={{backgroundColor: 'transparent'}}
          justifyContent="space-between">
          <TouchableOpacity
            style={[
              globalStyles.center,
              {
                backgroundColor: colors.gray800,
                borderRadius: 100,
                padding: 0,
                width: 38,
                height: 38,
                marginTop:26
              },
            ]}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              style={{marginLeft: 8}}
              name="arrow-back-ios"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
          </Row>
          </Section>
      <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 18 }}
          title="Categories"
        />
        <Row wrap="wrap" justifyContent="flex-start">
          {categories.map((item) => (
            <TouchableOpacity
              onPress={() => handleSelectedCategory(item.id)}
              style={[
                globalStyles.tag,
                {
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor: categoriesSelected.includes(item.id)
                    ? colors.black
                    : colors.white,
                },
              ]}
              key={item.id}
            >
              <TextComponent
                color={
                  categoriesSelected.includes(item.id)
                    ? colors.white
                    : colors.black
                }
                font={fontFamilies.poppinsMedium}
                text={item.title}
              />
            </TouchableOpacity>
          ))}
        </Row>
      </Section>

      <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 18 }}
          title="Price"
        />
        <Space height={12} />
        <RnRangeSlider
          min={0}
          step={1}
          max={maxPrice}
          renderThumb={(name) => (
            <View
              style={{
                width: 14,
                height: 14,
                borderWidth: 2,
                borderColor: colors.gray700,
                borderRadius: 100,
                backgroundColor: colors.white,
              }}
            >
              {name === 'high'}
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  left: -20,
                  bottom: 16,
                  width: 50,
                  alignItems: 'center',
                }}
              >
                <TextComponent
                  size={12}
                  color={colors.gray600}
                  text={
                    name === 'low'
                      ? `$${filterValues.price.low}`
                      : `$${filterValues.price.high.toLocaleString()}`
                  }
                />
              </View>
            </View>
          )}
          renderRail={() => (
            <View style={{ height: 3, width: '100%', backgroundColor: colors.gray400 }} />
          )}
          renderRailSelected={() => (
            <View style={{ height: 3, width: '100%', backgroundColor: colors.gray800 }} />
          )}
          onSliderTouchEnd={(low, high) => setFilterValues({ ...filterValues, price: { low, high } })}
          onValueChanged={(low, high) => {}}
        />
      </Section>

      {/* <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 18 }}
          title="Sort By"
        />
        <Row wrap="wrap" justifyContent="flex-start">
          {sortByValues.map((item) => (
            <TouchableOpacity
              onPress={() => setFilterValues({ ...filterValues, sortby: item.key })}
              style={[
                globalStyles.tag,
                {
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: filterValues.sortby === item.key ? colors.black : colors.white,
                },
              ]}
              key={item.key}
            >
              <TextComponent
                color={filterValues.sortby === item.key ? colors.white : colors.black}
                font={fontFamilies.poppinsMedium}
                text={item.title}
              />
            </TouchableOpacity>
          ))}
        </Row>
      </Section> */}
    <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 18 }}
          title="Brands"
        />
        <Row wrap="wrap" justifyContent="flex-start">
          {brands.map((item) => (
            <TouchableOpacity
              onPress={() => handleSelectedBrand(item.id)}
              style={[
                globalStyles.tag,
                {
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor: brandsSelected.includes(item.id)
                    ? colors.black
                    : colors.white,
                },
              ]}
              key={item.id}
            >
              <TextComponent
                color={
                  brandsSelected.includes(item.id)
                    ? colors.white
                    : colors.black
                }
                font={fontFamilies.poppinsMedium}
                text={item.title}
              />
            </TouchableOpacity>
          ))}
        </Row>
      </Section>

      {/* <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 18 }}
          title="Rating"
        />
        {Array.from({ length: 5 }).map(
          (item, index) =>
            5 - index > 1 && (
              <Row onPress={() => setRateSelected(5 - index)} key={`rating${index}`} styles={{ marginBottom: 12 }}>
                <Col>
                  <Row justifyContent="flex-start">
                    {Array.from({ length: 5 - index }).map((star, index) => (
                      <AntDesign
                        style={{ marginRight: 8 }}
                        name="star"
                        color={colors.warning}
                        size={20}
                        key={`star-${index}`}
                      />
                    ))}
                  </Row>
                </Col>
                {5 - index === rateSelected ? (
                  <TickCircle size={28} color={colors.black} variant="Bold" />
                ) : (
                  <FontAwesome name="circle" color={colors.gray500} size={24} />
                )}
              </Row>
            ),
        )}
      </Section> */}
    </Container>
  );
};

export default FilterScreen;
