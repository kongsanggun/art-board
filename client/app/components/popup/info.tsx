import './info.css';

const Info = ({ onOpenAlert }: { onOpenAlert: any }) => {
    return (
        <div className="infoBack">
            <div className="infoEmpty"> </div>
            <div className="info">
                <h1>방문록 이름</h1>
                <p>방문록 내용</p>
                <button className="infoBtn" onClick={onOpenAlert}> 닫기 </button>
            </div>
        </div>
    )
}

export default Info;