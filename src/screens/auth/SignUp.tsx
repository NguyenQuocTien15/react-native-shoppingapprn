import {
  Button,
  Input,
  Row,
  Section,
  Space,
  Text,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import { TickCircle, TickSquare } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
import { Container } from '../../components';
import { colors } from '../../constants/colors';
import { fontFamilies } from '../../constants/fontFamilies';
import firestore from '@react-native-firebase/firestore';

const initState = {
  username: '',
  email: '',
  password: '',
  confirm: '',
};

  const SignUp = ({ navigation }: any) => {
    const [registerForm, setRegisterForm] = useState(initState);
    const [isDisable, setIsDisable] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    useEffect(() => {
      const { email, password, confirm } = registerForm;
      if (password && confirm) {
        setErrorText(password !== confirm ? 'Password is not match!!' : '');
      }
      setIsDisable(!registerForm.email || !registerForm.password || !registerForm.confirm || errorText !== '');
    }, [registerForm, errorText]);

    const handleChangeForm = (val: string, key: string) => {
      const items: any = { ...registerForm };
      if (val && key) {
        items[`${key}`] = val;
        setRegisterForm(items);
      } else {
        console.log('Missing values');
      }
    };

    const saveUserInfoToFirestore = async (email: string, password: string, username: string) => {
      try {
        const createdAt = firestore.FieldValue.serverTimestamp();
        await firestore().collection('users').doc(email).set({
          email,
          password,
          username,
          createdAt,
          status: 'pending', // Trạng thái chờ xác nhận email
        });
        console.log('User info saved to Firestore successfully');
      } catch (error) {
        console.error('Error saving user info to Firestore:', error);
      }
    };
    // Gửi email xác nhận cho người dùng
    const sendEmailVerification = async (user: any) => {
      try {
        if (!user.emailVerified) {
          await user.sendEmailVerification();
          setIsEmailSent(true);
          console.log('Verification email sent');
        }
      } catch (error) {
        setErrorText('Failed to send verification email');
        console.log(error);
      }
    };
   // Tạo tài khoản Firebase, nhưng không cho phép đăng nhập ngay lập tức
   const createNewAccount = async () => {
    setIsLoading(true);
    try {
      // 1. Lưu thông tin người dùng vào Firestore với trạng thái 'pending'
      await saveUserInfoToFirestore(registerForm.email, registerForm.password, registerForm.username);

      // 2. Tạo tài khoản Firebase nhưng không cho phép đăng nhập ngay lập tức
      const userCredential = await auth().createUserWithEmailAndPassword(registerForm.email, registerForm.password);
      const user = userCredential.user;

      // 3. Gửi email xác minh
      await sendEmailVerification(user);

      // 4. Hiển thị thông báo yêu cầu người dùng xác minh email
      setErrorText('Please check your email and verify to complete registration.');

      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText('An unknown error occurred');
      }
  };
};

  // Kiểm tra thời gian đăng ký và xóa nếu quá 2 phút
  const renderButtonRegister = () => {
    return (
      <Button
        loading={isLoading}
        disable={isDisable}
        isShadow={false}
        title="Sign Up"
        textStyleProps={{ fontFamily: fontFamilies.poppinsBold }}
        color={colors.black}
        inline
        onPress={createNewAccount}
      />
    );
  };

  return (
    <Container>
      <Section>
        <Row styles={{ paddingVertical: 20, paddingTop: 32 }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 150, height: 150, resizeMode: 'contain' }}
          />
        </Row>
      </Section>
      <Section>
        <Text
          text="Sign Up"
          weight={'700'}
          font={fontFamilies.poppinsBold}
          size={Platform.OS === 'ios' ? 20 : 18}
        />
        <Text text="Create a new account" color={colors.description} />
      </Section>
      <>
        <Section>
          <Input
            value={registerForm.username}
            radius={0}
            color="transparent"
            bordered={false}
            labelStyleProps={{
              marginBottom: 0,
            }}
            styles={{
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => handleChangeForm(val, 'username')}
            placeholder="User name"
            clear
            label="User name"
          />
          <Input
            required
            helpText="Please enter your email"
            value={registerForm.email}
            radius={0}
            color="transparent"
            bordered={false}
            labelStyleProps={{
              marginBottom: 0,
            }}
            styles={{
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => handleChangeForm(val, 'email')}
            placeholder="Email"
            clear
            keyboardType="email-address"
            label="Email"
            affix={
              registerForm.email &&
              registerForm.email.includes('@') &&
              registerForm.email.includes('.') ? (
                <TickCircle variant="Bold" size={20} color={colors.black} />
              ) : null
            }
          />
          <Input
            value={registerForm.password}
            radius={0}
            color="transparent"
            password
            labelStyleProps={{
              marginBottom: 0,
            }}
            bordered={false}
            styles={{
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => {
              handleChangeForm(val, 'password');
            }}
            placeholder="Password"
            label="Password"
          />
          <Input
            value={registerForm.confirm}
            radius={0}
            color="transparent"
            password
            labelStyleProps={{
              marginBottom: 0,
            }}
            bordered={false}
            styles={{
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => {
              handleChangeForm(val, 'confirm');
            }}
            placeholder="Confirm"
            label="Confirm"
          />
        </Section>
        {errorText && (
          <Section>
            <Text text={errorText} color={'coral'} />
          </Section>
        )}
        <Section>
          <Row alignItems="flex-start">
            <TickSquare size={20} variant="Bold" color={colors.description} />
            <Space width={8} />
            <Text
              text="By creating an account, you agree with our terms & conditions"
              color={colors.description}
            />
          </Row>
        </Section>

        <Section>{renderButtonRegister()}</Section>

        <Row styles={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text text="You have an account? " />
          <Button
            title="Login"
            inline
            onPress={() => navigation.navigate('Login')}
            type="link"
          />
        </Row>
      </>
    </Container>
  );
};

export default SignUp;
