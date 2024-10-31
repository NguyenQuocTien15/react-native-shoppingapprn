// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity,
//   ActivityIndicator 
// } from 'react-native';
// import auth from'@react-native-firebase/auth';
// import { sendPasswordResetEmail,updatePassword } from 'firebase/auth'; 
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import  auth from '@react-native-firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
const ForgotPassword = ({ navigation }: any) =>   {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/; 
    if (!email || !emailRegex.test(email)) {
      setMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    // setIsLoading(true);
    // setMessage('');
    // try {
    //   await sendPasswordResetEmail(auth, email);
    //   setMessage('Email đặt lại mật khẩu đã được gửi!');
    //   setEmail(''); 
    // } catch (error) {
    //   console.error(error);
    //   switch(error) {
    //     case 'auth/user-not-found':
    //       setMessage('Không tìm thấy tài khoản với email này.');
    //       break;
    //     case 'auth/invalid-email':
    //       setMessage('Địa chỉ email không hợp lệ.');
    //       break;
    //     default:
    //       setMessage('Đã có lỗi xảy ra.');
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
    setIsLoading(true);
    setMessage('');
    try {
      await auth().sendPasswordResetEmail(email); // Sử dụng auth()
      setMessage('Email đặt lại mật khẩu đã được gửi!');
      setEmail(''); 
    } catch (error: any) { // Hoặc sử dụng FirebaseError từ firebase/app
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        setMessage('Không tìm thấy tài khoản với email này.');
      } else if (error.code === 'auth/invalid-email') {
        setMessage('Địa chỉ email không hợp lệ.');
      } else {
        setMessage('Đã có lỗi xảy ra.');
      }
    } finally {
      setIsLoading(false);
    }
   
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <TextInput
            style={styles.input}
            placeholder="Nhập   
địa chỉ email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#fff" /> 
            ) : (
                <Text style={styles.buttonText}>Gửi</Text>
            )}
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default ForgotPassword;