import socketio from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";


//export const socket = socketio.connect(process.env.REACT_APP_SOCKET_URI);
let originUrl = window.location.href
console.log("originUrl", originUrl);
originUrl = originUrl.replace("/projects","");

export const socket = socketio(process.env.REACT_APP_SOCKET_URI, {
    origin: originUrl, //'http://localhost:3000',
    transports: ['websocket'],      
  });
export const SocketContext = React.createContext();