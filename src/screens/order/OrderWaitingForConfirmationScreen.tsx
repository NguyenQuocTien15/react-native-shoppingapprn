import {View, Text, ScrollView, Image, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const OrderWaitingForConfirmationScreen = () => {
  const handleCancel =() => {}
  const handleConfirm = () => {};
  

  return (
    <View>
      
        <Text>No order found</Text>
      
    </View>
  );
  // return (
  //   <ScrollView style={{flex: 1}}>
  //     {/* <View style={{flexDirection: 'row', padding: 10}}>
  //       <Image
  //         style={{
  //           width: 100,
  //           height: 100,
  //           borderRadius: 12,
  //           marginRight: 10,
  //           backgroundColor: 'black',
  //         }}></Image>
  //       <View style={{flex: 1, flexDirection: 'column'}}>
  //         <Text style={styles.customText}>a</Text>
  //         <Text style={{color: 'black', fontSize: 18}}>b</Text>
  //         <View
  //           style={{
  //             flex: 1,
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignItems: 'flex-end',
  //           }}>
  //           <Text style={styles.customText}>price</Text>
  //           <View
  //             style={[
  //               styles.flexDirection,
  //               {
  //                 paddingVertical: 4,
  //                 borderRadius: 100,
  //                 alignItems: 'center',
  //               },
  //             ]}>
  //             <TouchableOpacity
  //               style={[
  //                 styles.touch,
  //                 {
  //                   backgroundColor: 'white',
  //                 },
  //               ]}>
  //               <Text
  //                 style={[
  //                   styles.textTouch,
  //                   {
  //                     color: 'black',
  //                   },
  //                 ]}>
  //                 Cancel
  //               </Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={[
  //                 styles.touch,
  //                 {backgroundColor: '#ff7891', marginLeft: 10},
  //               ]}>
  //               <Text
  //                 style={[
  //                   styles.textTouch,
  //                   {
  //                     color: 'white',
  //                   },
  //                 ]}>
  //                 Confirm
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     </View> */}
  //   </ScrollView>
  // );
};

export default OrderWaitingForConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  touch: {
    borderRadius: 5,
    borderColor: '#ff7891',
    borderWidth: 2,
  },
  textTouch: {
    fontSize: 20,
    paddingRight: 5,
    paddingLeft: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemListProduct: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
  },
  //

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
});
