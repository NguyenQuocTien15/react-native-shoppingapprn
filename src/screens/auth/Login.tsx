import {Button, Input, Row, Section, Text} from '@bsdaoquang/rncomponent';
import {Link, TickCircle} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Image, ScrollView} from 'react-native';
import {Container} from '../../components';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {globalStyles} from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localDataNames} from '../../constants/localDataNames';
import { Auth } from '../../utils/handleAuthen';

//login
const Login = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        const user = userCredential.user;

        if (user) {
          const data = {
            uid: user.uid,
            email: user.email ?? '',
            displayName: user.displayName ?? '',
            emailVerified: user.emailVerified,
            photoUrl: user.photoURL,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
            
          };
          dispatch(addAuth(data));
          await AsyncStorage.setItem(localDataNames.auth, JSON.stringify(data));
          await Auth.UpdateProfile(user);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log('Missing values');
    }
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
          text="Please login or singup to continue our app"
          color={colors.description}
        />
      </Section>
      <ScrollView style={[globalStyles.container]}>
        <Section>
          <Input
            required
            helpText="Please enter your email"
            value={email}
            radius={0}
            color="transparent"
            bordered={false}
            labelStyleProps={{
              marginBottom: 0,
            }}
            styles={{
              borderBottomColor: colors.dark,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => setEmail(val)}
            placeholder="Email"
            clear
            label="Email"
            affix={
              email && email.includes('@') && email.includes('.') ? (
                <TickCircle variant="Bold" size={20} color={colors.dark} />
              ) : null
            }
          />
          <Input
            value={password}
            radius={0}
            color="transparent"
            password
            labelStyleProps={{
              marginBottom: 0,
            }}
            bordered={false}
            styles={{
              borderBottomColor: colors.dark,
              borderBottomWidth: 1,
              paddingHorizontal: 0,
            }}
            onChange={val => setPassword(val)}
            placeholder="Password"
            label="Password"
          />
        </Section>

        <Row
          justifyContent="flex-end"
          styles={{paddingHorizontal: 16, marginBottom: 16}}>
          <Button
            title="Forgot Password?"
            inline
            onPress={() => navigation.navigate('ForgotPassword')}
            //onPress={() => {}}
            type="link"
          />
        </Row>
        
        
        <Section>
          <Button
            title="Login"
            inline
            textStyleProps={{fontFamily: fontFamilies.poppinsBold}}
            color={colors.dark}
            onPress={handleLogin}
            loading={isLoading}
          />
        </Section>

        <Row styles={{paddingHorizontal: 16, marginBottom: 16}}>
          <Text text="You have not account? " />
          <Button
            title="Sign up"
            inline
            onPress={() => navigation.navigate('SignUp')}
            type="link"
          />
        </Row>
       
      </ScrollView>
    </Container>
  );
};

export default Login;
