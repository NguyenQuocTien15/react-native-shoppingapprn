import { View, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { Text } from '@bsdaoquang/rncomponent';
import { sizes } from '../constants/sizes';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fontFamilies';

type Props = {
    text:string;
    size?:number;
    font?:string;
    flex?:number;
    numberOfLine?:number;
    color?:string;
    styles?:StyleProp<TextStyle>;
    type?:'bigTitle' | 'title' | 'text'|'description';
   

};

const TextComponent = (props: Props) => {

    const{text,size,font,flex,numberOfLine,color,styles,type} = props

    let fontSize: number = sizes.text
    let fontFamily: string = fontFamilies.poppinsRegular;
    switch (type) {
        case 'bigTitle':
            fontSize = sizes.bigTitle;
            break;
        case 'title':
            fontSize = sizes.title;
            break;
        case 'description':
            fontSize = sizes.description;
            break;
    
        default:
            fontSize = sizes.text;
            break;
    }
  return (
   <Text text={text} font={font ?? fontFamilies.poppinsRegular } flex ={flex} numberOfLine = {numberOfLine} size={size ?? sizes.text} color = {color ?? colors.black} styles={[{},styles]}
   weight={
    !type || (type !== 'bigTitle' && type !== 'title' ) ? '400' : 'bold'}
   />
  )
}

export default TextComponent;