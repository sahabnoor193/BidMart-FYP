// src/socket.js
import { io } from 'socket.io-client';
// http://localhost:5000
// https://subhan-project-backend.onrender.com
const socket = io('http://localhost:5000', {
  withCredentials: true,
});

export default socket;
