import './userList.css';

const UserList = ({userList}: {userList: string[]}) => {
  return (
    <div className='userList'>
      <div className='total'>접속자 수 : {userList.length}</div>
      {userList.map((item : string, index : number) => {
          return (<div className='user' key={index}>{item}</div>)
      })}
    </div>
  )
}

export default UserList;