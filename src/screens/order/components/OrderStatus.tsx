import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const OrderStatus = ({ statusId, children }: { statusId: string; children?: React.ReactNode }) => {
    const [statusName, setStatusName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchOrderStatus = async () => {
        try {
          const statusDoc = await firestore().collection('orderStatus').doc(statusId).get();
          if (statusDoc.exists) {
            const statusData = statusDoc.data();
            setStatusName(statusData?.orderStatusName || "Trạng thái không xác định");
          } else {
            setStatusName("Trạng thái không xác định");
          }
        } catch (error) {
          console.error("Error fetching order status:", error);
          setStatusName("Lỗi khi lấy trạng thái");
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrderStatus();
    }, [statusId]);
  
    if (loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
  
    return (
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 16, color: '#333' }}>
          {children} {statusName}
        </Text>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default OrderStatus;
