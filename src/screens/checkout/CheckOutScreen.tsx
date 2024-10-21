import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';

const CheckOutScreen = ({route}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
const {selectedItems} = route.params;
 
  const handlePaymentMethod = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.flexDirection}>
        <Text style={styles.customText}>Address:</Text>
        <Text
          style={[
            styles.customText,
            {flex: 1, marginLeft: 20, fontStyle: 'italic'},
          ]}>
          HH2A Đơn Nguyên A, ngõ 562 Nguyễn Văn Cừ, Long Biên
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View>
            {selectedItems.map(item => (
              <Text key={item.id}>
                {item.title} - {item.quantity}
              </Text>
            ))}
          </View>
        </View>

        <View style={{marginVertical: 10}}>
          <Text style={[{color: 'black', fontSize: 30}]}>Payment method</Text>
          <View style={[styles.flexDirection, {alignItems: 'center'}]}>
            <Text style={{color: 'black', fontSize: 20}}>
              Thanh toán khi nhận hàng
            </Text>
            <View>
              <TouchableOpacity onPress={handlePaymentMethod}>
                <View style={[styles.radioCircle, {borderColor: 'gray'}]}>
                  {checked && <View style={styles.selectedRb} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 22, color: 'black'}}>Total</Text>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              Price
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.touchCheckOut,
              {backgroundColor: checked ? '#FA7189' : '#A9A9A9'},
            ]}
            onPress={() => navigation.navigate('MyOrder')}
            disabled={!checked}>
            <Text style={styles.textCheckOut}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  touchCheckOut: {
    borderRadius: 10,
    marginTop: 10,
  },
  textCheckOut: {
    color: 'white',
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 32,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7891',
    borderColor: '#ff7891',
  },
});
