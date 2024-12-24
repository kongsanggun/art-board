import Pixel from './pixel.type';
import User from './user.type';

export default interface Room {
  uuid: string;
  userList: Map<string, User>;
  pixelList: Map<string, Pixel>;
  limitUser: number;
  updateTime: string;
}
