import { RoomData } from '@/app/module/types/room';
import './info.css';

const Info = ({ room, onOpenAlert }: { room: RoomData, onOpenAlert: () => void }) => {
    return (
        <div className="infoBack">
            <div className="infoEmpty"> </div>
            <div className="info">
                <div className="infoTitle">{room.name}</div>
                <div className="infoDetail" dangerouslySetInnerHTML={{__html: room.detail}}/>
                <div className="infoBtnList">
                    <button className="infoBtn" onClick={onOpenAlert}> 닫기 </button>
                </div> 
            </div>
        </div>
    )
}

export default Info;