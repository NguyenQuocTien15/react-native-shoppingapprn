import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Tabbar} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../../components';
import {fontFamilies} from '../../../constants/fontFamilies';
import {colors} from '../../../constants/colors';
import {CategoryModel} from '../../../models/CategoryModel';
import { categoriesRef } from '../../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
//import {categoriesRef} from '../../../firebase/firebaseConfig';


const CategoriesList = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories from Firebase
    categoriesRef.onSnapshot(snap => {
      if (snap.empty) {
        console.log('Categories not found!');
      } else {
        const items: CategoryModel[] = [];
        snap.forEach((item: any) =>
          items.push({
            id: item.id,
            ...item.data(),
          } as CategoryModel),
        );
        setCategories(items);
      }
    });
  }, []);

  const handleCategoryPress = (categoryId: string, categoryTitle: string) => {
    // @ts-ignore
    navigation.navigate('ProductsCategoryScreen', { categoryId , categoryTitle});
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabbar
        title="Categories"
        tabbarStylesProps={{ paddingHorizontal: 16 }}
        titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 20 }}
        renderSeemore={<TextComponent text="View all" color={colors.gray2} />}
        onSeeMore={() => {}}
      />

      {categories.length > 0 && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={categories}
          renderItem={({ item, index }) => (
            <View
              key={item.id}
              style={{
                marginLeft: 16,
                marginRight: index === categories.length - 1 ? 16 : 0,
              }}
            >
              <Button
                title={item.title}
                onPress={() => handleCategoryPress(item.id,item.title)}
                color={colors.black}
                styles={{
                  paddingVertical: 4,
                  paddingHorizontal: 20,
                }}
                inline
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default CategoriesList;
