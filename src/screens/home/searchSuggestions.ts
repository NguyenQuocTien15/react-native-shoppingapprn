import firestore from '@react-native-firebase/firestore';
import { ProductModel } from '../../models/ProductModel';

export const getSuggestions = async (searchTerm: string): Promise<ProductModel[]> => {
    if (!searchTerm || searchTerm.trim() === "") {
        console.error("Search term is empty or invalid.");
        return []; // Trả về mảng rỗng nếu từ khóa tìm kiếm không hợp lệ
    }

    const searchWords = searchTerm.split(" ");
    const suggestionsSet = new Set<ProductModel>(); // Sử dụng Set để loại bỏ trùng lặp

    try {
        // Tạo các truy vấn cho từng trường
        const productsQuery = firestore().collection('products');

        // Tạo mảng các truy vấn cho title
        const queries = searchWords.map(word => {
            return productsQuery
                .where('title', '>=', word)
                .where('title', '<=', word + '\uf8ff')
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        suggestionsSet.add({ id: doc.id, ...doc.data() } as ProductModel);
                    });
                })
                .catch(error => console.error("Error fetching products:", error));
        });

        // Chạy tất cả các truy vấn song song
        await Promise.all(queries);

        // Lặp lại cho categories và brands nếu bạn có trường đó trong sản phẩm
        const categoriesQuery = await firestore().collection('categories');
        const brandsQuery = await firestore().collection('brands');

        // Tìm kiếm trong categories
        const categoryPromises = searchWords.map(word => {
            return categoriesQuery
                .where('title', '>=', word)
                .where('title', '<=', word + '\uf8ff')
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        // Bạn có thể xử lý các danh mục tìm thấy ở đây
                        console.log("Found category:", doc.data().title);
                    });
                })
                .catch(error => console.error("Error fetching categories:", error));
        });

        await Promise.all(categoryPromises);

        // Tìm kiếm trong brands
        const brandPromises = searchWords.map(word => {
            return brandsQuery
                .where('title', '>=', word)
                .where('title', '<=', word + '\uf8ff')
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        // Bạn có thể xử lý các nhãn hiệu tìm thấy ở đây
                        console.log("Found brand:", doc.data().title);
                    });
                })
                .catch(error => console.error("Error fetching brands:", error));
        });

        await Promise.all(brandPromises);

        return Array.from(suggestionsSet); // Trả về mảng gợi ý không trùng lặp
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        throw error; // Ném lại lỗi để xử lý bên ngoài nếu cần
    }
};
