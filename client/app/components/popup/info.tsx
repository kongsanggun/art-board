import { RoomData } from '@/app/module/types/room';
import './info.css';

const Info = ({ room, onOpenAlert }: { room: RoomData, onOpenAlert: () => void }) => {
    return (
        <div className="infoBack">
            <div className="infoEmpty"> </div>
            <div className="info">
                <h1>{room.name}</h1>
                <div className="infoDetail">
                    {room.detail}
                </div>
                <div className="infoBtnList">
                    <button className="infoBtn" onClick={onOpenAlert}> 미리보기 </button>
                    <button className="infoBtn" onClick={onOpenAlert}> 닫기 </button>
                </div> 
            </div>
        </div>
    )
}

export default Info;