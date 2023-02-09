import {socketIOClient, socketio}  from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";


//export const socket = socketio.connect(process.env.REACT_APP_SOCKET_URI);
let originUrl = window.location.href
console.log("originUrl", originUrl);
if (originUrl.includes("/projects")) {
    originUrl = originUrl.replace("/projects","");
} else {
    originUrl = originUrl.split("/signin")[0];
}
console.log("originUrl2", originUrl);

export const socket = socketIOClient(process.env.REACT_APP_SOCKET_URI, {
    //origin: originUrl, //'http://localhost:3000',
    transports: ['websocket'],      
  });
export const SocketContext = React.createContext();