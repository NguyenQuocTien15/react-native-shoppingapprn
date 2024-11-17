import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { useNavigation } from '@react-navigation/native';
import { globalStyles, Row } from '@bsdaoquang/rncomponent';
import TextComponent from './TextComponent';
import { colors } from '../constants/colors';

type Props = {
    children: ReactNode;
    bigTitle?: string,
    back?: boolean;
    left?: ReactNode;
    right?:ReactNode;
    isScroll?: boolean;
    //nẳm ngoài scrollVIew
    bottomComponent?: ReactNode;
};

const Container = (props: Props) => {
    const {children, bigTitle, back,left,right,isScroll,bottomComponent} = props;
    const navigation = useNavigation();

    return (
      <SafeAreaView style={[globalStyles.container]}>
        {(back || left || bigTitle || right) && (
          <Row
            styles={{
              marginTop: 5,
              padding: 1,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}>
            {back && (
              <TouchableOpacity
                style={[
                  globalStyles.center,
                  {
                    backgroundColor: colors.black,
                    borderRadius: 100,
                    padding: 0,
                    width: 34,
                    height: 34,
                    marginTop: 26,
                  },
                ]}
                onPress={() => navigation.goBack()}>
                <MaterialIcons
                  style={{ marginLeft: 8 }}
                  name="arrow-back-ios"
                  size={22}
                  color={colors.white}
                />
              </TouchableOpacity>
            )}
            {left && !back && <TextComponent text='Left' />}
            <View style={{ paddingHorizontal: 5, paddingVertical: 5,marginTop: 5,padding:1, flex: 1 }}>
              {bigTitle && <TextComponent text={bigTitle} type="bigTitle" styles={{marginTop:20,marginLeft:10}}/>}
            </View>
            {right && right}
          </Row>
        )}
        {isScroll ? (
          <ScrollView style={globalStyles.container}>{children}</ScrollView>
        ) : (
          <View style={globalStyles.container}>{children}</View>
        )}
        {bottomComponent && bottomComponent}
      </SafeAreaView>
    );
  };


export default Container;
