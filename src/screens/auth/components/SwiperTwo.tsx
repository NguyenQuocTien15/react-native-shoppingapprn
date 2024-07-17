import {View, Text, Image} from 'react-native';
import React from 'react';
import {sizes} from '../../../constants/sizes';
import {TextComponent} from '../../../components';
import { fontFamilies } from '../../../constants/fontFamilies';
import { Button, Row, Section } from '@bsdaoquang/rncomponent';
import { ArrowLeft, ArrowRight } from 'iconsax-react-native';
import { colors } from '../../../constants/colors';

const SwiperOne = () => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1.2, maxHeight: sizes.height * 0.6,padding: 20}}>
        <Image
          source={require('../../../assets/images/sliders/slide-2.png')}
          style={{flex: 1, resizeMode: 'stretch', width: sizes.width - 40}}
        />
      </View>
      <Section styles={{paddingTop:24}} >
        <TextComponent
          text={`20% Discount \nNew Arrival products`}
          size={30}
          type="title"
          font={fontFamilies.poppinsBold} ></TextComponent>
          <TextComponent
          numberOfLine={2}
          color={colors.description}
          text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, explicabo. Dolorem voluptatum dolores vitae. Nemo est, iste odit quasi consectetur repellendus eligendi ullam illo ut accusantium quae error similique atque! '
          />
      </Section>
      
    </View>
  );
};

export default SwiperOne;
