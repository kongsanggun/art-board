import { FocusEvent, useEffect, useState } from 'react';

import '@/app/room/[id]/page.css';
import './sidemenu.css';

import { RoomData } from '@/app/module/types/room';
import { Pixel } from '@/app/module/types/pixel';

import Tool from './tool';
import Title from './title';
import UserList from './userList';
import Info from '../popup/info';


const Sidemenu = ({room, userList, toggleEvent, pixelData, handler}: {room: RoomData, userList: string[], toggleEvent: () => void, pixelData: Pixel, handler: (value: Pixel) => void}) => {
    const [history, setHistory] = useState(pixelData.colorHistory);
    const [infoPop, setInfoPop] = useState(false);

    useEffect(() => {
        const color = document.querySelector('#color') as HTMLInputElement;
        color.value = pixelData.color;

        const tool = document.querySelector('#tool > #' + pixelData.tool) as HTMLElement
        tool.className += ' btn_active';

        const brash = document.querySelector('#brash > #size_' + pixelData.brashSize) as HTMLElement
        brash.className += ' btn_active';
    }, [pixelData.brashSize, pixelData.color, pixelData.tool])

    // 색 변경 적용
    const colorChange = (e : FocusEvent) => {
        history.push((e.target as HTMLInputElement).value as string);
        setHistory(history.slice(-4));

        pixelData.color = (e.target as HTMLInputElement).value as string
        pixelData.colorHistory = history
        handler(pixelData)
    }

    const ColorHisChange = (value : string) => {
        const color = document.querySelector('#color') as HTMLInputElement;
        color.value = value
        pixelData.color = value;
        handler(pixelData)
    }

    const ToolChange = (target : string) => {
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

    const brashChange = (e : React.MouseEvent<HTMLElement, MouseEvent>) => {
        const value = (e.target as HTMLInputElement).id.replace("size_", "");
        document.querySelectorAll('.brashSize').forEach((item) => {
            item.className = item.className.replaceAll(' btn_active', '')
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
        <div className="sideBack">
            {infoPop? <Info room = {room} onOpenAlert = {() => {setInfoPop(!infoPop)}}/> : null}
            <div className='sideCloseButton' onClick={toggleEvent}/>
            <div className='side'>
                <Title title = {room.name} handler = {() => {setInfoPop(!infoPop)}}/>
                <div className="sideTool">
                    <Tool title="도구">
                        <div id="tool" className="toolDiv">
                            <button id="move" className="toolButton" onClick={() => {ToolChange("move")}}> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={36} height={36}>
                                <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg> 
                            </button>
                            <button id="pen" className="toolButton" onClick={() => {ToolChange("pen")}}> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={36} height={36}>
                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                            </button>
                            <button id="erase" className="toolButton" onClick={() => {ToolChange("erase")}}> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={36} height={36}>
                                <path d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7L288 480l9.4 0L512 480c17.7 0 32-14.3 32-32s-14.3-32-32-32l-124.1 0L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416l-9.4 0-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"/></svg>
                            </button>
                            <input id='color' className="toolButton" type="color" onBlur={colorChange}/>
                        </div>     
                    </Tool>
                    <Tool title="색상 이력">
                        {
                            pixelData.colorHistory.map((item, index) => {return(<button key={index} className = "historyButton" style={{ backgroundColor: item }} onClick={() => {ColorHisChange(item)}}> </button>)})
                        }
                    </Tool>
                    <Tool title="브러시 크기">
                        <div id="brash" className="toolDiv">
                            <button id = "size_7" className = "brashSize" onClick={brashChange}> 큼 </button>
                            <button id = "size_5" className = "brashSize" onClick={brashChange}> 보통 </button>
                            <button id = "size_3" className = "brashSize" onClick={brashChange}> 작음 </button>
                        </div>
                    </Tool>
                </div>
                <UserList room = {room} userList = {userList} />
            </div>
        </div>
    ) 
}

export default Sidemenu;
