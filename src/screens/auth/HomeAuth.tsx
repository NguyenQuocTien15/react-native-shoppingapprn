import { View, Text, ImageBackground, StatusBar } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/globalStyles'
import { Button, Section } from '@bsdaoquang/rncomponent'
import { fontFamilies } from '../../constants/fontFamilies'

const HomeAuth = ({navigation}: any /*vào màn hình này thì bấm bất cứ chỗ nào cũng gọi đến navigation */ ) => {
  return (
    <>
    <StatusBar hidden/>
    <ImageBackground
   source={require('../../assets/images/bg-login.png')}
   imageStyle={{flex:1, resizeMode:'cover'}}
   style={(globalStyles.container)}>
    <View style={{flex:1,}}></View>
    <Section styles={{paddingVertical:16}}>
        <Button title='Login' textStyleProps={{
            fontWeight:'600',
            fontFamily: fontFamilies.poppinsBold,
            fontSize: 16,
        }}
         onPress={() => navigation.navigate('SwiperScreen', {authState:'Login'})}></Button>
        <Button 
        color='transparent' 
        title='Sign up'
        styles={{borderColor: 'white', paddingVertical: 14}}
        textStyleProps={{fontWeight:'600',
            fontFamily: fontFamilies.poppinsBold
        }}
        onPress={() => navigation.navigate('SwiperScreen',{authState:'Signup'})}></Button>
    </Section>
   </ImageBackground>

    
    </>
   
  )
}

export default HomeAuth