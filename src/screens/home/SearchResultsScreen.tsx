// import { View, Text, ActivityIndicator, FlatList } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { ProductModel } from '../../models/ProductModel';
// import { Container, ProductItem, TextComponent } from '../../components';
// import { Section } from '@bsdaoquang/rncomponent';
// import { colors } from '../../constants/colors';
// import { globalStyles } from '../../styles/globalStyles';
// import firestore from '@react-native-firebase/firestore';
// import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// const SearchResultProduct = ({ navigation, route }: any) => {
//   const {
//     searchTerm,
//   }: {
//     searchTerm: string;
//   } = route.params;

//   const [isLoading, setIsLoading] = useState(false);
//   const [products, setProducts] = useState<ProductModel[]>([]);

//   useEffect(() => {
//     searchProducts();
//   }, [searchTerm]);

//   const searchProducts = async () => {
//     setIsLoading(true);
//     console.log(searchTerm);
//     try {
//       const productsCollection = firestore().collection('products');

//       const snap = await productsCollection.get();
//       const allProducts: ProductModel[] = [];
//       snap.forEach((doc) => {
//         allProducts.push({ id: doc.id, ...doc.data() } as ProductModel);
//       });

//       // Filter products based on search term
//       const filteredProducts = allProducts.filter((product) => {
//         const lowerSearchTerm = searchTerm.toLowerCase();
//         return (
//           product.title?.toLowerCase().includes(lowerSearchTerm) ||
//           product.brand?.toLowerCase().includes(lowerSearchTerm) ||
//           product.description?.toLowerCase().includes(lowerSearchTerm) ||
//           product.categories.some((cat: string) => cat.toLowerCase().includes(lowerSearchTerm)) ||
//           product.type?.toLowerCase().includes(lowerSearchTerm)
//         );
//       });

//       setProducts(filteredProducts);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container back title='Search Results' isScroll={false}>
//       {
//         isLoading ? (
//           <Section styles={[globalStyles.center, { flex: 1 }]}>
//             <ActivityIndicator size={24} color={colors.gray} />
//           </Section>
//         ) : (
//           <Section>
//             <FlatList
//               numColumns={2}
//               ListEmptyComponent={
//                 <Section styles={[globalStyles.center, { flex: 1 }]}>
//                   <TextComponent text='No products found' />
//                 </Section>
//               }
//               data={products}
//               showsVerticalScrollIndicator={false}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//               renderItem={({ item }) => <ProductItem key={item.id} product={item} />} />
//           </Section>
//         )}
//     </Container>
//   );
// };

// export default SearchResultProduct;

import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ProductModel } from '../../models/ProductModel';
import { Container, ProductItem, TextComponent } from '../../components';
import { Section } from '@bsdaoquang/rncomponent';
import { colors } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import firestore from '@react-native-firebase/firestore';

const SearchResultProduct = ({ navigation, route }: any) => {
  const { searchTerm }: { searchTerm: string } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    searchProducts();
  }, [searchTerm]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const productsCollection = firestore().collection('products');
      const snap = await productsCollection.get();
      const allProducts: ProductModel[] = [];
      
      snap.forEach((doc) => {
        allProducts.push({ id: doc.id, ...doc.data() } as ProductModel);
      });

      // Use Fuse.js to perform fuzzy search on all fields
      const fuse = new Fuse(allProducts, {
        keys: ['title', 'brand', 'description', 'categories', 'type'],
        threshold: 0.3, // Adjust sensitivity: lower is more precise, higher allows more lenient matching
        includeScore: true,
      });

      const results = fuse.search(searchTerm);
      const filteredProducts = results.map((result) => result.item);

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container back title='Search Results' isScroll={false}>
      {isLoading ? (
        <Section styles={[globalStyles.center, { flex: 1 }]}>
          <ActivityIndicator size={24} color={colors.gray} />
        </Section>
      ) : (
        <Section>
          <FlatList
            numColumns={2}
            ListEmptyComponent={
              <Section styles={[globalStyles.center, { flex: 1 }]}>
                <TextComponent text='No products found' />
              </Section>
            }
            data={products}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => <ProductItem key={item.id} product={item} />}
          />
        </Section>
      )}
    </Container>
  );
};

export default SearchResultProduct;
