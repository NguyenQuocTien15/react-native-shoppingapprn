import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Container } from '../../components';
import { Row, Section } from '@bsdaoquang/rncomponent';
import Avatar from '../../components/Avatar';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const flatListRef = useRef<FlatList>(null); // Tạo tham chiếu đến FlatList
  const [isScrolling, setIsScrolling] = useState<boolean>(false); 

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);

      const fetchChatId = async () => {
        const chatsRef = firestore().collection('chats');
        const chatsSnapshot = await chatsRef
          .where("user_ID", "==", currentUser.uid)
          .limit(1)
          .get();

        if (!chatsSnapshot.empty) {
          setChatId(chatsSnapshot.docs[0].id);
        } else {
          const newChatDoc = await chatsRef.add({ user_ID: currentUser.uid });
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
            createdAt: doc.data().createdAt?.toDate(),
          })) as MessageModel[];

          setMessages(newMsgs);
        });

      return () => unsubscribe();
    }
  }, [chatId]);

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
      // Cuộn đến cuối khi tin nhắn mới được thêm
      flatListRef.current?.scrollToEnd({ animated: true });
     // Cuộn đến cuối khi tin nhắn mới được thêm và người dùng không đang cuộn lên
    if (!isScrolling) {
      // Sau khi tin nhắn mới được thêm, gọi scrollToEnd để cuộn xuống cuối
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Đợi một chút sau khi tin nhắn được thêm vào
    }
  };

  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Nếu người dùng cuộn gần đến cuối, tự động cuộn xuống sau khi gửi tin nhắn mới
    setIsScrolling(contentOffsetY + layoutHeight < contentHeight - 20); // Điều chỉnh giá trị 20 nếu cần
  };
  const renderItem = ({ item }: { item: MessageModel }) => (
    <View style={[styles.message, item.sender_ID === userId ? styles.userMessage : styles.adminMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
      {item.createdAt &&  (
        <Text style={styles.timestamp}>{item.createdAt.toLocaleTimeString([],{hour: '2-digit',minute:'2-digit'})}</Text>
      )}
    </View>
  );

  return (
    <Container back bigTitle='Chat' isScroll={false}> 
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid
      >
        <FlatList
        ref={flatListRef} 
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          onScroll={handleScroll} 
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </KeyboardAwareScrollView>
      
      {/* Phần input và nút gửi */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor='black'
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Entypo name="paper-plane" size={29} color="white" />
        </TouchableOpacity>
      </View>
    </View>
    </Container>
    
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 25,
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
    color: "black",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    alignSelf: 'flex-end',
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
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ChatScreen;
