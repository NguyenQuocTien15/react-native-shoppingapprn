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
  Space,
  Tabbar,
} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import {CategoryModel} from '../../../models/CategoryModel';
import firestore from '@react-native-firebase/firestore';
import RnRangeSlider from 'rn-range-slider';
import { ProductModel } from '../../../models/ProductModel';

const FilterScreen = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const[priceSelected,setPriceSelected] = useState({
    low: 0,
    high: 1000,
  });
  const [maxPrice,setMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  //gọi hàm getData
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      //gọi hàm lấy loại
      await getCategories();
      await handleGetMaxPrice();
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

  // hàm lấy giá 1 item cao nhất
  const handleGetMaxPrice = async () => {
    const snap = await firestore()
    .collection('products')
    .orderBy('price')
    .limitToLast(1)
    .get();

    //lấy 1 item giá ở thời điểm lớn nhất nếu snap k rỗng
    if (!snap.empty) {
      const items:ProductModel[] = []
      snap.forEach((item: any)=>
        {items.push({...item.data()});
    });
    items.length > 0 && setMaxPrice(items[0].price);
    setPriceSelected({...priceSelected, high : items[0].price});
    }
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
        <Space height={12}/>
        <RnRangeSlider
          min={0}
          step={1}
          max={maxPrice}
          renderThumb={(name)=> <View
          style={{
            width:14,
            height:14,
            borderWidth:2,
            borderColor: colors.gray700,
            borderRadius:100,
            backgroundColor: colors.white,
          }}>
            {
              name === 'high'
            }
            <View
            style={{
              position:'absolute',
              right:0,
              left:-20,
              bottom:16,
              width:50,
              alignItems:'center'
            }}>
              <TextComponent
               size={12}
                color={colors.gray600}
                 text={name==='low'
                 ?`$${priceSelected.low}`:
                 `$${priceSelected.high.toLocaleString()}` }/>
            </View>
          </View>
          
        }
          renderRail={()=> <View
          style={{
            height:3,
            width:'100%',
            backgroundColor:colors.gray400
          }}
          ></View>}
          renderRailSelected={()=> <View
            style={{
              height:3,
              width:'100%',
              backgroundColor:colors.gray800
            }}
            ></View>}
         //giá trị mặc định khi vào min là bnh
         onSliderTouchEnd={(low,high)=>setPriceSelected({low,high})}
          onValueChanged={(low,high)=> {}}       
        />
        
      </Section>
      {/* lọc theo giá */}
    </Container>
  );
};

export default FilterScreen;
