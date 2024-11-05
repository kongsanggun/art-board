import { useEffect, useState } from 'react';
import '../../App.css';
import './sidemenu.css'
import { Pixel } from '../../util/pixel';

const Sidemenu = ({userList, toggleEvent, pixelData, handler}: {userList: String[], toggleEvent: any, pixelData: Pixel, handler: any}) => {
    
    const [history, setHistory] = useState(pixelData.colorHistory);

    useEffect(() => {
        // TODO : 도구 및 브러쉬 크기의 정보를 불러온다.
        const color = document.querySelector('#color') as any;
        color.value = pixelData.color;

        const tool = document.querySelector('#tool > #' + pixelData.eraseCheck) as HTMLElement
        tool.className += ' btn_active';

        const brash = document.querySelector('#brash > #size_' + pixelData.brashSize) as HTMLElement
        brash.className += ' btn_active';
    }, [])

    const checkItemHandler = (e : any) => {
        pixelData.eraseCheck = e
        handler(pixelData)
    }

    // 색 변경 적용
    const colorChange = (e : any) => {
        history.push(e.target.value as string);
        setHistory(history.slice(-6, 5));

        pixelData.color = e.target.value as string
        pixelData.colorHistory = history
        handler(pixelData)
    }

    const ColorHisChange = (value : string) => {
        const color = document.querySelector('#color') as any;
        color.value = value
        pixelData.color = value;
        handler(pixelData)
    }

    const ToolChange = (e : any) => {
        document.querySelectorAll('.toolButton').forEach((item) => {
            item.className = item.className.replace(' btn_active', '')
        })
        const test = document.querySelector('#' + e) as HTMLElement
        test.className += ' btn_active';
        checkItemHandler(e)
    }

    const brashChange = (value : any) => {
        document.querySelectorAll('.brashSize').forEach((item) => {
            item.className = item.className.replace(' btn_active', '')
        })
        const test = document.querySelector('#size_' + value) as HTMLElement
        test.className += ' btn_active';

        pixelData.brashSize = value
        handler(pixelData)

        const cousor = document.querySelector('.cousor') as HTMLElement;
        if(cousor === null) return;

        cousor.style.width = `${value}px`;
        cousor.style.height = `${value}px`;
    }
    
    return (
        <>
            <div className='sideCloseButton' onClick={toggleEvent}/>
            <div className='side'>
                <div className="sideTitle">
                    <span>사이버 방명록</span>
                </div>
                <div className="sideTool">
                    <div className="toolTitle">도구</div>
                    <div className="sideDiv">
                        <div id="tool" className="toolDiv">
                            <button id = "false" className = "toolButton" onClick={() => {ToolChange(false)}}> 펜 </button>
                            <button id = "true" className = "toolButton" onClick={() => {ToolChange(true)}}> 지우개 </button>
                        </div>
                        <div>
                            <input className="toolButton" type="color" id='color' onBlur={colorChange} />
                        </div>
                    </div>
                    <div className="toolTitle">색상 이력</div>
                    <div className="toolDiv">
                        {
                            history.map((item) => {
                                return(<button className = "historyButton" style={{ background: item }} onClick={() => {ColorHisChange(item)}}> </button>)
                            })
                        }
                    </div>
                    <div className="toolTitle">브러시 크기</div>
                    <div id="brash" className="toolDiv">
                        <button id = "size_7" className = "brashSize" onClick={() => {brashChange("7")}}> 큼 </button>
                        <button id = "size_5" className = "brashSize" onClick={() => {brashChange("5")}}> 보통 </button>
                        <button id = "size_3" className = "brashSize" onClick={() => {brashChange("3")}}> 작음 </button>
                    </div>
                </div>
                <div className="sideUser">
                    <div className='userTotal'> 
                            <span className = "user">접속자</span>
                            <span id = "currentUser">{userList.length}</span> 
                    </div>
                    {userList.map((item : any) => {
                        return (<div className='userInfo'> {item} </div>)
                    })}
                </div>
            </div>
        </>
    )
}

export default Sidemenu;
