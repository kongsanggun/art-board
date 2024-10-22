import '../../App.css';
import './sidemenu.css'

const Sidemenu = ({userList : userList}: any) => {
    return (
        <div className='side'>
            <div className='userTotal'> 
                <span className = "user">접속자</span>
                <span id = "currentUser">{userList.length}</span> 
                / 
                <span id = "maxUser">20</span> 
            </div>
            {userList.map((item : any) => {
                return (<div className='userInfo'> {item} </div>)
            })}
        </div>
    )
}

export default Sidemenu;