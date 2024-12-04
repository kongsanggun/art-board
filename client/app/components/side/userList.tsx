import './userList.css';

const UserList = ({userList}: {userList: string[]}) => {
  return (
    <div className='userList'>
      <div className='total'>접속자 수 : {userList.length}</div>
      {userList.map((item : string) => {
          return (<div className='user' key="">{item}</div>)
      })}
    </div>
  )
}

export default UserList;