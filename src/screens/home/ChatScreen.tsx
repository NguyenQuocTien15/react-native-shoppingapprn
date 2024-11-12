import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageModel[]>([
    {
      id: 'default',
      message: 'Hello. How can I help you?',
      sender_ID: 'admin',
      createdAt: null,
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy userId từ Firebase Authentication
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      
      // Kiểm tra và lấy hoặc tạo chatId từ Firestore
      const fetchChatId = async () => {
        const chatsRef = firestore().collection('chats'); 
        const chatsSnapshot = await chatsRef
          .where("user_ID", "==", currentUser.uid)
          .limit(1)
          .get();

        if (!chatsSnapshot.empty) {
          // Nếu chat đã tồn tại
          setChatId(chatsSnapshot.docs[0].id);
        } else {
          // Nếu chưa có, tạo mới một chat và lưu user_ID
          const newChatDoc = await chatsRef.add({
            user_ID: currentUser.uid,
          });
          setChatId(newChatDoc.id);
        }
      };

      fetchChatId();
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = firestore()
        .collection('chats')
        .doc(chatId)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          const newMsgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MessageModel[];
  
          // Kiểm tra dữ liệu có thay đổi so với trước không
          console.log("New messages:", newMsgs);
  
          // Loại bỏ các tin nhắn trùng lặp
          const uniqueMsgs:any = [];
          const seenIds = new Set();
  
          newMsgs.forEach((message) => {
            if (!seenIds.has(message.id)) {
              uniqueMsgs.push(message);
              seenIds.add(message.id);
            }
          });
  
          // Cập nhật lại danh sách tin nhắn
          setMessages(newMsgs);
        });
  
      // Cleanup để hủy đăng ký khi component bị unmount hoặc chatId thay đổi
      return () => unsubscribe();
    }
  }, [chatId]); // Lắng nghe khi chatId thay đổi
  

  const handleSendMessage = async () => {
    if (newMessage.trim().length === 0 || !chatId || !userId) return;

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection("messages")
      .add({
        message: newMessage,
        sender_ID: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    setNewMessage("");
  };

 

  const renderItem = ({ item }: { item: MessageModel }) => (
    <View style={[styles.message, item.sender_ID === userId ? styles.userMessage : styles.adminMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        //inverted
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles go here
const styles = StyleSheet.create({
  container: {
    marginTop:25,
    flex: 1,
    justifyContent: 'space-between',
  },
  chatList: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  adminMessage: {
    backgroundColor: '#E5E5E5',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0084ff',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default ChatScreen;
