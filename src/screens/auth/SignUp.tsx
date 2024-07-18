import {ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {fontFamilies} from '../../constants/fontFamilies';
import {Container, TextComponent} from '../../components';
import {
  Button,
  globalStyles,
  Input,
  Row,
  Section,
  Space,
  Text,
} from '@bsdaoquang/rncomponent';
import {Image} from 'react-native';
import {colors} from '../../constants/colors';
import {Check, TickCircle, TickSquare, User} from 'iconsax-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initState = {
  username: '',
  email: '',
  password: '',
  confirm: '',
};
const SignUp = ({navigation}: any) => {
  const [registerForm, setRegisterForm] = useState(initState);
  const handleChangeForm = (val: string, key: string) => {
    const items: any = {...registerForm};
    if (val && key) {
      items[`${key}`] = val;
      setRegisterForm(items);
    } else {
      console.log('MIssing value');
    }
  };
  const createNewAccount = async () => {
    console.log(registerForm);
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
        <Text text="Sign Up" font={fontFamilies.poppinsBold} size={18} />
        <Text text="Create a new account" color={colors.description} />
      </Section>
      <ScrollView style={globalStyles.container}>
        <Section>
          <Input
            helpText="Please enter your name"
            value={registerForm.username}
            radius={0}
            color="transparent"
            bordered={false}
            styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
            onChange={val => handleChangeForm(val, 'username')}
            placeholder="User name"
            clear
            label="User name"
          />
          <Input
            required = {true}
            helpText="Please enter your email"
            value={registerForm.email}
            radius={0}
            color="transparent"
            bordered={false}
            styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
            onChange={val => handleChangeForm(val, 'email')}
            placeholder="Email"
            clear
            keyboardType="email-address"
            label="Email"
            affix={
              registerForm.email &&
              registerForm.email.includes('@') &&
              registerForm.email.includes('.') ? (
                <TickCircle variant="Bold" size={20} color={colors.dark} />
              ) : null
            }
          />
          <Input
            value={registerForm.password}
            radius={0}
            color="transparent"
            password
            bordered={false}
            styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
            onChange={val => handleChangeForm(val, 'password')}
            placeholder="Password"
            label="Password"
            // passwordShowHideButton={{
            //   show: '',
            //   hide: ''
            // }}
          />
          <Input
            value={registerForm.password}
            radius={0}
            color="transparent"
            password
            bordered={false}
            styles={{borderBottomColor: colors.dark, borderBottomWidth: 1}}
            onChange={val => handleChangeForm(val, 'confirm')}
            placeholder="Confirm Password"
            label="Confirm Password"
            // passwordShowHideButton={{
            //   show: '',
            //   hide: ''
            // }}
          />
        </Section>
        <Section>
          <Row alignItems="flex-start">
            <TickSquare size={20} variant="Bold" color={colors.description} />
            <Space width={8} />
            <Text
              text="By create an account, you have agree with our term & condication"
              color={colors.description}
            />
          </Row>
        </Section>
        <Section>
          <Button
            title="Sign Up"
            color={colors.dark}
            onPress={createNewAccount}
          />
        </Section>
        <Row styles={{paddingHorizontal: 16, marginBottom: 16}}>
          <Text text="Do you have account yet ?  " />
          <Button
            title="Sign In"
            inline
            onPress={() => navigation.navigate('Login')}
            type="link"
          />
        </Row>
      </ScrollView>
    </Container>
  );
};

export default SignUp;
