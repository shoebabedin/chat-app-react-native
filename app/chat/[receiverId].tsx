/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

type Message = {
  sender_id: number;
  receiver_id: number;
  text: string;
  timestamp: string;
};

export default function ChatScreen() {
  const { user } = useAuth();
  const { receiverId } = useLocalSearchParams();
  const receiverIdNum = typeof receiverId === "string" ? parseInt(receiverId) : 0;
  const senderId = Number(user?.uid); // if uid is number
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://<your-ip>:3000/api/messages/${senderId}/${receiverIdNum}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    const handleMessage = (msg: Message) => {
      if (
        (msg.sender_id === senderId && msg.receiver_id === receiverIdNum) ||
        (msg.sender_id === receiverIdNum && msg.receiver_id === senderId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    fetchMessages();
    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [senderId, receiverIdNum]);


  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:5000/api/messages/${senderId}/${receiverIdNum}`);
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      sender_id: senderId,
      receiver_id: receiverIdNum,
      text,
    };

    await fetch(`http://<your-ip>:3000/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    socket.emit("sendMessage", message);
    setText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender_id === senderId ? styles.sent : styles.received,
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    maxWidth: "80%",
  },
  sent: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#EEE",
    alignSelf: "flex-start",
  },
  text: { fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
});
