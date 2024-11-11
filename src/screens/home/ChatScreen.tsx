import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { chatsRef } from '../../firebase/firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
interface ChatModel {
  id: string;
  messages: MessageModel[];
}

interface MessageModel {
  id: string;
  text: string;
  senderId: string;
  timestamp: firebase.firestore.Timestamp | null;
}

const ChatScreen = ({ role }: { role: 'admin' | 'client' }) => {
  const [messages, setMessages] = useState<MessageModel[]>([
    {
      id: 'default',
      text: 'Hello. How can I help you?',
      senderId: 'admin',
      timestamp: null,
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>('');

  const chatId = "rxc5ZaeOc3bwbEJy0wgI";  // Example chat ID
  const userId = role === 'admin' ? 'adminId' : 'clientId';  // Example sender ID

  const handleSendMessage = async () => {
    if (newMessage.trim().length === 0) return;

    await chatsRef
      .doc(chatId)
      .collection("messages")
      .add({
        text: newMessage,
        senderId: userId,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

    setNewMessage(''); // Clear input after sending
  };

  useEffect(() => {
    const unsubscribe = chatsRef
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MessageModel[];

        // Update state only if there are new messages
        if (JSON.stringify(msgs) !== JSON.stringify(messages)) {
          setMessages(msgs);
        }
      });

    return () => unsubscribe();
  }, [messages]);

  const renderItem = ({ item }: { item: MessageModel }) => (
    <View style={[styles.message, item.senderId === userId ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
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

const styles = StyleSheet.create({
  container: {
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
  botMessage: {
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
