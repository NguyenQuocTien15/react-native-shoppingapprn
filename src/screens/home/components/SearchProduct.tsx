import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../../components/Container';
import { globalStyles } from '../../../styles/globalStyles';
import SearchResultsScreen from '../SearchResultsScreen';

import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation<any>();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Chuyển hướng đến màn hình kết quả tìm kiếm
      navigation.navigate('SearchResultsScreen', { searchTerm });
    }
  };

  return (
    <Container>
      <View style={globalStyles.searchContainer}>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search for products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={handleSearch}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default SearchProduct;
