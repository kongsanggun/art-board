import { Pixel } from "./pixel";

export interface SocketResponce{
  name? : string;
  userList : string[];
  roomID : string;
  data : PixelList & Pixel;
  pixelData : Pixel[]
}

export interface UserList{
  name: string;
  userList: string[];
}

export interface PixelList{
  pixelData: Pixel[];
}