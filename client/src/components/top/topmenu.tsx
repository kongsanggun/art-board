import { useState } from 'react';

import '../../App.css';
import './topmenu.css'

const Topmenu = ({handler : handler}: any) => {
    const [disabled, setDisabled] = useState(true);

    const brashChange = (e : any) => {
        handler("brashSize", e.currentTarget.value)
        const cousor = document.querySelector('.cousor') as HTMLElement;
        if(cousor === null) return;

        cousor.style.width = `${e.currentTarget.value}px`;
        cousor.style.height = `${e.currentTarget.value}px`;
    }

    const checkItemHandler = (e : any) => {
        handler("eraseCheck", null)
        setDisabled(!disabled)
    }

    // 색 변경 적용
    const colorChange = (e : any) => {
        handler("color", e.target.value)
    }

    return (
        <div className="artEditorTool">
            <p className="toolSpan">도구</p>
            <div className='toolToggle toolSpan'>
                {
                    (disabled) 
                    ? <button className = "toggleButton" onClick={checkItemHandler}> 펜 </button>
                    : <button className = "toggleButton" onClick={checkItemHandler}> 지우개 </button>
                }
            </div>
            <p className="toolSpan">색</p>
            <input className="color toolSpan" type="color" onChange={colorChange} />
            <p className="toolSpan">브러쉬 크기</p>
            <label className="colorSpan">
                <select className="brashTool" name="brashSize" onChange={brashChange}>
                    <option value="7">큼</option>
                    <option value="5" selected>보통</option>
                    <option value="3">작음</option>
                </select>
            </label>
        </div>
    )
}

export default Topmenu;