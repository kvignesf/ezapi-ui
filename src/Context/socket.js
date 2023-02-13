import {io}  from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";


let originUrl = window.location.href
console.log("originUrl", originUrl);
if (originUrl.includes("/projects")) {
    originUrl = originUrl.replace("/projects","");
} else {
    originUrl = originUrl.split("/signin")[0];
}
console.log("originUrl2", originUrl);

export const socket = io(process.env.REACT_APP_SOCKET_URI, {
    transports: ['websocket'],      
  });
export const SocketContext = React.createContext();