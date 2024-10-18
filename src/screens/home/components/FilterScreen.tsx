import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container, TextComponent} from '../../../components';
import {SearchNormal} from 'iconsax-react-native';
import {
  colors,
  globalStyles,
  Row,
  Section,
  Tabbar,
} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import {CategoryModel} from '../../../models/CategoryModel';
import firestore from '@react-native-firebase/firestore';

const FilterScreen = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //gọi hàm getData
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getCategories();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  //cần categories
  const getCategories = async () => {
    //.get() lấy hết tất cả
    const snap = await firestore().collection('categories').get();
    //nếu item k rỗng thì lấy hết tất cả cái còn lại "...item.data"
    if (!snap.empty) {
      const items: CategoryModel[] = [];
      snap.forEach((item: any) => items.push({id: item.id, ...item.data()}));
      setCategories(items);
    }
  };
  // kiem tra neu IsLoading khong co du lieu thi return tra cho 1 section
  // <ActivityIndicator></ActivityIndicator> thoi gian cho de len database lay du lieu ve xong roi moi tra lai <Container></Container>

  //hàm chọn 1 loại
  const handleSelectedCategory = (id: string) => {
    const items = [...categoriesSelected];
    const index = items.findIndex(element => element === id);
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }
    setCategoriesSelected(items);
  };
  return isLoading ? (
    <Section>
      <ActivityIndicator></ActivityIndicator>
    </Section>
  ) : (
    <Container
      back
      right={
        <TouchableOpacity>
          <SearchNormal size={24} color={colors.gray} />
        </TouchableOpacity>
      }>
      <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{fontFamily: fontFamilies.poppinsBold, fontSize: 18}}
          title="Categories"
        />
        <Row wrap="wrap" justifyContent="flex-start">
          {categories.map(item => (
            //gọi hàm chọn 1 loại
            <TouchableOpacity
              onPress={() => handleSelectedCategory(item.id)}
              style={[
                globalStyles.tag,
                {
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  //chọn màu trắng or đen khi dc chọn
                  backgroundColor: categoriesSelected.includes(item.id)
                    ? colors.black
                    : colors.white,
                },
              ]}
              key={item.id}>
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
      {/* lọc theo giá */}
      <Section>
        <Tabbar
          showSeeMore={false}
          titleStyleProps={{fontFamily: fontFamilies.poppinsBold, fontSize: 18}}
          title="Price"
        />
      </Section>
      {/* lọc theo giá */}
    </Container>
  );
};

export default FilterScreen;
