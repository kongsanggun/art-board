import { io, Socket } from "socket.io-client";

import { Pixel } from "../types/pixel";
import { SocketResponce } from "../types/websocket";

type afterFunction = {
  [key: string]: (data: SocketResponce) => void;
}

export class boardSocket {
  socket: Socket;
  afterFunction: object;

  constructor(afterFunction: afterFunction) {
    if(process.env.NEXT_PUBLIC_REACT_APP_URL === '' || process.env.NEXT_PUBLIC_REACT_APP_URL === undefined) {
      throw Error("소켓 연결 주소가 없음");
    }

    this.socket = io(process.env.NEXT_PUBLIC_REACT_APP_URL, {
      transports: ['websocket'], 
      autoConnect: false,
    })

    this.afterFunction = afterFunction;
  }

  open = (name : string) => {
    if(this.socket.disconnect()) {
      this.socket.open();
      this.socket.on("connect", () => {
        this.socket.emit("enter", name);
    });
    }
    this.on();
  }

  on = () => {
    console.log(this.socket)
    for(const key of Object.keys(this.afterFunction)) {
      this.socket.on(key, this.afterFunction[key])
    }
  }

  emit = (pixelData : Pixel) => {
    // TODO : 소켓이 불러와지지 않는 오류 고쳐야함
    const massge = pixelData.tool;
    const param = {
        "color": pixelData.color,
        "location": pixelData.location,
        "userName": pixelData.userName,
        "brashSize": pixelData.brashSize,
        "timestamp": "null"
    };
    console.log(this.socket)
    this.socket.emit(massge, param);
  }

}