// client/src/socket.js
import { io } from 'socket.io-client';

// In development, it uses localhost. In production, it uses your live server URL.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  autoConnect: false,
});
