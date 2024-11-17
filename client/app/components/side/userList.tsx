import './userList.css';

const UserList = ({userList}: {userList: string[]}) => {
  return (
    <div className='user'>
      <div className='total'>접속자 수 : {userList.length}</div>
      {userList.map((item : any) => {
          return (<div className='info' key="">{item}</div>)
      })}
    </div>
  )
}

export default UserList;