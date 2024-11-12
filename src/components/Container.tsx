import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { useNavigation } from '@react-navigation/native';
import { globalStyles, Row } from '@bsdaoquang/rncomponent';
import TextComponent from './TextComponent';
import { colors } from '../constants/colors';

type Props = {
    children: ReactNode;
    title?: string,
    back?: boolean;
    left?: ReactNode;
    right?:ReactNode;
    isScroll?: boolean;
};

const Container = (props: Props) => {
    const {children, title, back,left,right,isScroll} = props;
  return (
    <SafeAreaView style={[globalStyles.container]}>
      {
        (back || left || title || right) && 
        <Row
          styles={{
            backgroundColor:'coral',
            paddingHorizontal: 16,
            paddingVertical:12,
          }}>
            {back && <TextComponent text='Back'/>}
            {left && !back && <TextComponent text='Left'/>}
            <View style={{paddingHorizontal: 16,flex:1}}>
              {title && (<TextComponent text='{title}'  type="bigTitle"/>)}
            </View>
            {right && right}
          </Row>
        }
        {!isScroll && isScroll !== false ? 
        (<ScrollView style={globalStyles.container}>
          {children}
        </ScrollView>) : (<View style={globalStyles.container}>{children}</View>)
        }
    </SafeAreaView>
  );
}

export default Container;
