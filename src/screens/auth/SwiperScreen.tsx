import {  StatusBar, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, TextComponent } from '../../components'
import Swiper from 'react-native-swiper'
import SwiperOne from './components/SwiperOne'
import { Button, globalStyles, Row, Section } from '@bsdaoquang/rncomponent'
import { colors } from '../../constants/colors'
import { ArrowRight } from 'iconsax-react-native'
import SwiperTwo from './components/SwiperTwo'
import SwiperThree from './components/SwiperThree'
import { useIsFocused } from '@react-navigation/native'
//Display splash Screen
const SwiperScreen = ({navigation,route}:any) => {
    const {authState} = route.params;
   
    const[index,setIndex] =useState(0);
    const isFocused = useIsFocused();
    useEffect(()=> {
        setIndex(0);
    },[isFocused])
    
  return (
    <View style={[globalStyles.container, {paddingTop:20}]}>
        <StatusBar hidden/>
        <Swiper
        index={index}
        onIndexChanged={int => setIndex(int)}
        showsPagination={false} loop={false}>
           <SwiperOne/>
           <SwiperTwo/>
           <SwiperThree/>
        </Swiper>  
        <Section>
        <Row justifyContent='space-between'>
            <Row>
                {Array.from({length:3}).map((_item,ind)=><View key={`dot${ind}`}
                 style={{
                    height:6,
                    backgroundColor:ind === index ? colors.dark : colors.gray2,
                    borderRadius:100,
                    width:ind === index ? 16 : 6,
                    marginRight:4}}/>)}
            </Row>
          
            <Button
            color={colors.dark}
            styles={{
                paddingHorizontal:12,
            }}
            icon={<ArrowRight size={24} color='white'/>} 
            //chuyen man hinh qua login
            onPress={() => index === 2 ? navigation.navigate(authState) : setIndex(index + 1)}
          />
        </Row>
      </Section>
    </View>
  )
}

export default SwiperScreen