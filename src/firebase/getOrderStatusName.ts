import firestore from '@react-native-firebase/firestore';

// Hàm lấy trạng thái từ Firebase
const getOrderStatusName = async (statusId: string) => {
  try {
    const statusDoc = await firestore().collection('orderStatus').doc(statusId).get();
    if (statusDoc.exists) {
      const statusData = statusDoc.data();
      return statusData?.orderStatusName || "Trạng thái không xác định";
    } else {
      return "Trạng thái không xác định";
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    return "Trạng thái không xác định";
  }
};

// Sử dụng trong code
getOrderStatusName("1").then((statusName) => {
  console.log(statusName); // Output: "Đang xử lý"
});
