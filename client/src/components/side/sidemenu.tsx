import { useEffect, useState } from 'react';

import '../../App.css';
import './sidemenu.css';

import { Pixel } from '../../util/pixel';

import Tool from './tool';
import Title from './title';
import UserList from './userList';

const Sidemenu = ({userList, toggleEvent, pixelData, handler}: {userList: String[], toggleEvent: any, pixelData: Pixel, handler: any}) => {
    const [history, setHistory] = useState(pixelData.colorHistory);

    useEffect(() => {
        const color = document.querySelector('#color') as any;
        color.value = pixelData.color;

        const tool = document.querySelector('#tool > #' + pixelData.tool) as HTMLElement
        tool.className += ' btn_active';

        const brash = document.querySelector('#brash > #size_' + pixelData.brashSize) as HTMLElement
        brash.className += ' btn_active';
    }, [pixelData.brashSize, pixelData.color, pixelData.tool])

    // 색 변경 적용
    const colorChange = (e : any) => {
        history.push(e.target.value as string);
        setHistory(history.slice(-4));

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
        const target = e.target.id
        if(target === "move") {
            const canvas = document.querySelector('.canvas') as HTMLElement
            canvas.style.touchAction = "auto ";
        } else {
            const canvas = document.querySelector('.canvas') as HTMLElement
            canvas.style.touchAction = "none";
        }

        document.querySelectorAll('.toolButton').forEach((item) => {
            item.className = "toolButton"
        })

        const active = document.querySelector('#' + target) as HTMLElement
        active.className += ' btn_active'

        pixelData.tool = target
        handler(pixelData)
    }

    const brashChange = (e : any) => {
        const value = e.target.id.replace("size_", "");

        document.querySelectorAll('.brashSize').forEach((item) => {
            item.className = item.className.replace(' btn_active', '')
        })
        const active = document.querySelector('#size_' + value) as HTMLElement
        active.className += ' btn_active';

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
                <Title title = {"사이버 방명록"} />
                <div className="sideTool">
                    <Tool title="도구">
                        <div id="tool" className="toolDiv">
                            <button id="move" className="toolButton" onClick={ToolChange}> 없음 </button>
                            <button id="pen" className="toolButton" onClick={ToolChange}> 펜 </button>
                            <button id="erase" className="toolButton" onClick={ToolChange}> 지우개 </button>
                        </div>
                        <div>
                            <input id='color' className="toolButton" type="color" onBlur={colorChange}/>
                        </div>        
                    </Tool>
                    <Tool title="색상 이력">
                        {
                            pixelData.colorHistory.map((item) => {return(<button key="" className = "historyButton" style={{ background: item }} onClick={() => {ColorHisChange(item)}}> </button>)})
                        }
                    </Tool>
                    <Tool title="브러시 크기">
                        <div id="brash">
                            <button id = "size_7" className = "brashSize" onClick={brashChange}> 큼 </button>
                            <button id = "size_5" className = "brashSize" onClick={brashChange}> 보통 </button>
                            <button id = "size_3" className = "brashSize" onClick={brashChange}> 작음 </button>
                        </div>
                    </Tool>
                </div>
                <UserList userList = {userList} />
            </div>
        </>
    ) 
}

export default Sidemenu;
