import { RoomData } from '@/app/module/types/room';
import './userList.css';

const UserList = ({room, userList}: {room: RoomData, userList: string[]}) => {
  return (
    <div className='userList'>
      <div className='total'>접속자 수 : {userList.length} / 최대 : {room.limitUser}명</div>
      {userList.map((item : string, index : number) => {
          return (<div className='user' key={index}>{item}</div>)
      })}
    </div>
  )
}

export default UserList;