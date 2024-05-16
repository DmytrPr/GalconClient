import { useEffect, useRef, useState } from 'react';
import { ClientMessage, ServerMessage } from '../interfaces/message';

const useWebSocket = () => {
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');//TODO change to getting backend adress from constants.settings

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const message: ServerMessage = JSON.parse(event.data);
      setMessages((prevMessages:ServerMessage[] ) => [...prevMessages, message]);

      const msg_event = new CustomEvent('newMessage', { detail: message });
      window.dispatchEvent(msg_event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection not established');
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
