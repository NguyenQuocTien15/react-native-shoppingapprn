import { firebase } from "@react-native-firebase/auth";
interface MessageModel {
        id: string;
        text: string;
        senderId: string;
        timestamp: Date | null;
      }