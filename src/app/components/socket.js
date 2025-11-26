"use client"
import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
     socket = io(`${process.env.NEXT_PUBLIC_LOCAL_PORT}`, {
  transports: ['websocket', 'polling'] ,
   withCredentials: true
});
  }
  return socket;      
}