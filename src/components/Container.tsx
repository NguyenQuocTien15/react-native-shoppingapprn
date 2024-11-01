import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { useNavigation } from '@react-navigation/native';
import { globalStyles, Row } from '@bsdaoquang/rncomponent';
import TextComponent from './TextComponent';
import { colors } from '../constants/colors';

type Props = {
  children: ReactNode;
  title?: string;
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  isScroll?: boolean;
    //nẳm ngoài scrollVIew
  bottomComponent?: ReactNode;
};

const Container = (props: Props) => {
  const { children, title, back, left, right, isScroll, bottomComponent } = props;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[globalStyles.container]}>
      {
        (back || left || title || right) && 
        <Row
          styles={{
            marginTop: 16,
            padding: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {back && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="arrow-back-ios"
                size={22}
                color={colors.dark} // màu trắng từ colors
              />
            </TouchableOpacity>
          )}
          {left && !back && <TextComponent text='Left' />}
          <View style={{ paddingHorizontal: 16, flex: 1 }}>
            {title && <TextComponent text={title} type="bigTitle" />}
          </View>
          {right && right}
        </Row>
      }
      {!isScroll && isScroll !== false ? 
        (<ScrollView style={globalStyles.container}>
          {children}
        </ScrollView>) : (<View style={globalStyles.container}>{children}</View>)
      }
      {bottomComponent && bottomComponent}
    </SafeAreaView>
  );
};

export default Container;
