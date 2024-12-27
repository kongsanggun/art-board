import { io, Socket } from "socket.io-client";

import { Pixel } from "../types/pixel";
import { SocketResponce } from "../types/websocket";

type afterFunction = {
  [key: string]: (data: SocketResponce) => void;
}

export class boardSocket {
  socket: Socket;
  afterFunction: afterFunction;
  isConnect: boolean = false;

  constructor(afterFunction: afterFunction) {
    if(process.env.NEXT_PUBLIC_REACT_APP_URL === '' || process.env.NEXT_PUBLIC_REACT_APP_URL === undefined) {
      throw Error("소켓 연결 주소가 없음");
    }

    this.socket = io(`${process.env.NEXT_PUBLIC_REACT_APP_URL}`, {
      transports: ['websocket'], 
      autoConnect: false,
    })

    this.afterFunction = afterFunction;
  }

  open = (name : string, roomId: string) => {
    if(!this.isConnect) {
      this.socket.open();
      this.socket.on("connect", () => {
        this.isConnect = true;
      });
      this.on();
    }

    this.socket.emit("enter", {name : name, roomId : roomId});
  }

  on = () => {
    for(const key of Object.keys(this.afterFunction)) {
      this.socket.on(key, this.afterFunction[key])
    }
  }

  emit = (pixelData : Pixel) => {
    const massge = pixelData.tool;
    const param = {
        "color": pixelData.color,
        "location": pixelData.location,
        "userName": "",
        "brashSize": pixelData.brashSize,
        "timestamp": new Date().toUTCString()
    };
    this.socket.emit(massge, param);
  }
}