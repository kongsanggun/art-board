import { useEffect, useState } from 'react';

import './shortcut.css';

import { Pixel } from '../../util/pixel';

const ShortCut = ({toggleEvent, pixelData, handler}: {toggleEvent: any, pixelData: Pixel, handler: any}) => {
    const [history, setHistory] = useState(pixelData.colorHistory);

    useEffect(() => {
        const color = document.querySelector('#color') as any;
        color.value = pixelData.color;

        const tool = document.querySelector('#tool > #' + pixelData.tool) as HTMLElement
        tool.className += ' shortcutButton_active';
    }, [pixelData.color, pixelData.tool])

    // 색 변경 적용
    const colorChange = (e : any) => {
        history.push(e.target.value as string);
        setHistory(history.slice(-4));

        pixelData.color = e.target.value as string
        pixelData.colorHistory = history
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

        document.querySelectorAll('.shortcutButton').forEach((item) => {
            item.className = "shortcutButton"
        })

        const active = document.querySelector('#' + target) as HTMLElement
        active.className += ' shortcutButton_active'

        pixelData.tool = target
        handler(pixelData)
    }

    return (
        <>
            <div className="sideButton" onClick={toggleEvent}/>
            <div id="tool" className="shortcut">
                <button id="move" className="shortcutButton" onClick={ToolChange}> 없음 </button>
                <button id="pen" className="shortcutButton" onClick={ToolChange}> 펜 </button>
                <button id="erase" className="shortcutButton" onClick={ToolChange}> 지우개 </button>
                <input id='color' className="shortcutButton" type="color" onBlur={colorChange}/>
            </div>
        </>
    ) 
}

export default ShortCut;
