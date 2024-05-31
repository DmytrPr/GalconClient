/* eslint-disable import/no-extraneous-dependencies */
import * as dotenv from 'dotenv';
import { useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import { ClientMessage } from './types';

dotenv.config();

const { SERVER_URL } = process.env;

export default function useServer() {
  const { sendMessage, readyState, lastMessage } = useWebSocket(
    SERVER_URL ?? 'ws://localhost:8080'
  );

  const sendFormattedMessage = useCallback(
    (msg: ClientMessage) => {
      try {
        sendMessage(JSON.stringify(msg));
      } catch (e) {
        console.error(e);
      }
    },
    [sendMessage]
  );

  return { sendMessage: sendFormattedMessage, readyState, lastMessage };
}
