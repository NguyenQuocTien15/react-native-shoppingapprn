import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../../components/Container';
import { globalStyles } from '../../../styles/globalStyles';
import SearchResultsScreen from '../SearchResultsScreen';

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
        <Button title="Search" onPress={handleSearch} />
      </View>
    </Container>
  );
};

export default SearchProduct;