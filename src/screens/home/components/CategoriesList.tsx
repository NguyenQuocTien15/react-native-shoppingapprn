import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Tabbar } from '@bsdaoquang/rncomponent';
import { TextComponent } from '../../../components';
import { fontFamilies } from '../../../constants/fontFamilies';
import { colors } from '../../../constants/colors';
import { CategoryModel } from '../../../models/CategoryModel';
import { categoriesRef } from '../../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

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
    // Navigate to ProductsCategoryScreen with categoryId and categoryTitle
    //@ts-ignore
    navigation.navigate('ProductsCategoryScreen', { categoryId, categoryTitle });
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabbar
        title="Categories"
        tabbarStylesProps={{ paddingHorizontal: 0 }}
        titleStyleProps={{ fontFamily: fontFamilies.poppinsBold, fontSize: 20 }}
        onSeeMore={() => {}}
      />

      {categories.length > 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <Button
              title={item.title}
              onPress={() => handleCategoryPress(item.id, item.title)}
              color={colors.black}
              styles={{
                paddingVertical: 4,
                paddingHorizontal: 20,
                marginRight: 8, // Add some margin to space out the buttons
              }}
              inline
            />
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No categories found.</Text> // Show if no categories are available
      )}
    </View>
  );
};

export default CategoriesList;
