// PriceWithOffer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { colors } from '../constants/colors';

type PriceWithOfferProps = {
  originalPrice: number;
  offerPrice: number;
};

const PriceWithOffer: React.FC<PriceWithOfferProps> = ({ originalPrice, offerPrice }) => {
  return (
    <View style={styles.container}>
      <TextComponent
        text={`$${originalPrice.toLocaleString()}`}
        size={16}
        font={fontFamilies.poppinsRegular}
        color={colors.gray}
        styles={styles.originalPrice}
      />
      <TextComponent
        text={`$${offerPrice.toLocaleString()}`}
        size={20}
        font={fontFamilies.poppinsSemiBold}
        color={colors.success} // Change color as desired
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
});

export default PriceWithOffer;
