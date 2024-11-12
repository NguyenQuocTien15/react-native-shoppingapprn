import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AddressScreen = () => {
  return (
    <View style={styles.container}>

        <ScrollView>
          <View>
            <Text style={styles.label}>Thông tin liên hệ</Text>
            <View style={styles.customView}>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên...."
                value={userName}
                onChangeText={setUserName}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại hợp lệ..."
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.label}>Thông tin địa chỉ</Text>
            <View style={styles.customView}>
              <Picker
                selectedValue={selectedProvince}
                onValueChange={value => setSelectedProvince(value)}>
                <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                {provinces.map(province => (
                  <Picker.Item
                    key={province.code}
                    label={province.name}
                    value={province.code}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedDistrict}
                onValueChange={value => setSelectedDistrict(value)}
                enabled={!!selectedProvince}>
                <Picker.Item label="Chọn quận/huyện" value="" />
                {districts.map(district => (
                  <Picker.Item
                    key={district.code}
                    label={district.name}
                    value={district.code}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedWard}
                onValueChange={value => setSelectedWard(value)}
                enabled={!!selectedDistrict}>
                <Picker.Item label="Chọn xã/phường" value="" />
                {wards.map(ward => (
                  <Picker.Item
                    key={ward.code}
                    label={ward.name}
                    value={ward.code}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Thông tin địa chỉ</Text>
            <View style={styles.customView}>
              <TextInput
                style={styles.input}
                placeholder="Nhập thông tin địa chỉ..."
                value={houseNumber}
                onChangeText={setHouseNumber}
              />
            </View>
            {selectedWard &&
            selectedDistrict &&
            selectedProvince &&
            houseNumber ? (
              <View>
                <Text style={styles.label}>Địa chỉ của bạn</Text>
                <View style={styles.customView}>
                  <Text style={{color: 'black', fontSize: 18}}>
                    {fullAddress}
                  </Text>
                </View>
              </View>
            ) : (
              <Text>''</Text>
            )}
          </View>
        </ScrollView>

      <View style={{margin: 10}}>
        <TouchableOpacity
          style={styles.touchCheckOut}
          onPress={handleConfirmAddress}
         >
          <Text style={styles.textCheckOut}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddressScreen

const styles = StyleSheet.create({})