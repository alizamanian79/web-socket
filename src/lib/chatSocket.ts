// lib/chatSocket.ts
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_SERVER}/ws`;
let stompClient: Client | null = null;
let isConnected = false;

export const connect = (
  roomId: string,
  onMessageReceived: (msg: any) => void,
  onConnect?: () => void
) => {
  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);
// Optional: automatic reconnect

  stompClient.onConnect = () => {
    isConnected = true;
    stompClient?.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
      onMessageReceived(JSON.parse(message.body));
    });
    onConnect?.();
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker error:', frame.headers['message'], frame.body);
  };

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient?.connected) {
    stompClient.deactivate();
    isConnected = false;
  }
};


const send = (destination: string, payload: any) => {
  if (!stompClient || !isConnected) {
    console.warn('STOMP client not connected yet.');
    return;
  }

  stompClient.publish({
    destination,
    body: JSON.stringify(payload),
  });
};

export const sendMessage = (roomId: string, message: any, type: string = 'MESSAGE') => {
  send(`/app/chat/send/${roomId}`, { ...message, type });
};

export const sendJoin = (roomId: string, sender: string) => {
  send(`/app/chat/add/${roomId}`, { sender });
  
};

export const sendLeave = (roomId: string, sender: string) => {
  send(`/app/chat/leave/${roomId}`, { sender });
};

export const sendTyping = (roomId: string, sender: string) => {
  send(`/app/chat/typing/${roomId}`, { sender });
};

export const sendStopTyping = (roomId: string, sender: string) => {
  send(`/app/chat/stopTyping/${roomId}`, { sender });
};
