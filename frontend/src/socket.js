// src/socket.js
import { io } from 'socket.io-client';
// http://localhost:5000
// https://subhan-project-backend.onrender.com
const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

export default socket;
