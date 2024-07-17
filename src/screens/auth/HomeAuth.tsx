import { View, Text, ImageBackground, StatusBar } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/globalStyles'
import { Button, Section } from '@bsdaoquang/rncomponent'

const HomeAuth = () => {
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
            fontSize: 16,
        }}
         onPress={() => {}}></Button>
        <Button 
        color='transparent' 
        title='Sign up'
        styles={{borderColor: 'white', paddingVertical: 14}}
        textStyleProps={{fontWeight:'600'}}
        onPress={() => {}}></Button>
    </Section>
   </ImageBackground>

    
    </>
   
  )
}

export default HomeAuth