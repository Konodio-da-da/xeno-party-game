// client/src/socket.js
import { io } from 'socket.io-client';

// We now use VITE_API_URL to match your Vercel settings.
// IMPORTANT: Replace the fallback URL below with your actual live Railway URL just in case!
const SERVER_URL = import.meta.env.VITE_API_URL || 'https://xeno-party-game-production.up.railway.app';

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'], // Critical for Railway/Vercel connections
  secure: true,
  withCredentials: true
});
