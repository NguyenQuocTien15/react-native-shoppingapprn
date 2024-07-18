import {ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {fontFamilies} from '../../constants/fontFamilies';
import {Container, TextComponent} from '../../components';
import {Button, globalStyles, Input, Row, Section, Text} from '@bsdaoquang/rncomponent';
import {Image} from 'react-native';
import {colors} from '../../constants/colors';
import {Check, TickCircle, User} from 'iconsax-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Login = ({navigation}:any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log(email, password);
  };
  return (
    <Container isScroll={false}>
      <Section>
        <Row styles={{paddingVertical: 20, paddingTop: 32}}>
          <Image
            source={require('../../assets/logo.png')}
            style={{width: 150, height: 150, resizeMode: 'contain'}}
          />
        </Row>
      </Section>
      <Section>
        <Text text="Welcome!" font={fontFamilies.poppinsBold} size={18} />
        <Text
          text="Please login or signup to continue an app"
          color={colors.description}
        />
      </Section>
      <ScrollView style={globalStyles.container}>
      
      <Section>
        <Input
        required
        helpText='Please enter your email'
          value=""
          radius={0}
          color="transparent"
          bordered={false}
          styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
          onChange={val => console.log('affad')}
          placeholder="Email"
          clear

          label="Email"
          affix={
          email && email.includes('@') && email.includes('.') ?
          (<TickCircle variant="Bold" size={20} color={colors.dark}/>) : null}
        />
        <Input
          value=""
          radius={0}
          color="transparent"
          password
          bordered={false}
          styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
          onChange={val => console.log('affad')}
          placeholder="Password"
          label="Password"
          // passwordShowHideButton={{
          //   show: '',
          //   hide: ''
          // }}
        />
      </Section>
        <Row justifyContent='flex-end' styles={{paddingHorizontal:16, marginBottom:16}}>
          <Button title='Forgot Password?' onPress={() => {}} type='link'/>
        </Row>
      <Section>
        <Button title="Login" inline color={colors.dark} onPress={handleLogin} />
      </Section> 
      <Row styles={{paddingHorizontal:16,marginBottom:16}}>
        <Text text='Have you not account yet? '/>
        <Button title='Sign Up' inline onPress={() => navigation.navigate('SignUp')} type='link'/>

      </Row>
      <Section>
        <Button
          title="Continue with Facebook"
          icon={
            <Ionicons name="logo-facebook" size={18} color={colors.white} />
          }
          textStyleProps={{fontFamily: fontFamilies.poppinsMedium}}
          color={'#0866ff'}
          onPress={handleLogin}
        />
      </Section>
      <Section>
        <Button
          title="Continue with Google"
          icon={
            <Ionicons name="logo-google" size={18} color={colors.dark} />
          }
          textStyleProps={{fontFamily: fontFamilies.poppinsMedium}}
          
          onPress={handleLogin}
        />
      </Section>
      <Section>
        <Button
          title="Continue with Apple"
          icon={
            <Ionicons name="logo-apple" size={18} color={colors.dark} />
          }
          textStyleProps={{fontFamily: fontFamilies.poppinsMedium}}
         
          onPress={handleLogin}
        />
      </Section>
      </ScrollView>
      
    </Container>
  );
};

export default Login;
