// useWebSocket.ts
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface WebSocketMessage {
  sender: string;
  content: string;
}

const useWebSocket = () => {
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!roomId) return; // Avoid setting up WebSocket if roomId is not defined
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_SERVER}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket Error: ", frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMessage = {
        sender: user, // این مقدار را می‌توانید از لاگین بگیرید
        content: message,
        type: "CHAT",
      };
      stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(chatMessage),
      });
      setMessage("");
    }
  };

  return {
    messages,
    message,
    roomId,
    user,
    setMessage,
    setRoomId, // Now returning setRoomId
    setUser,   // Now returning setUser
    sendMessage,
  };
};

export default useWebSocket;
