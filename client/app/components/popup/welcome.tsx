"use client"

import React, { useState } from "react";
import './welcome.css';

const Welcome = ({ room, onOpenAlert }: { room: any, onOpenAlert: any }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const start = () => {
        if(text === "" || text === null) {
            setError(true)
            return;
        }
        onOpenAlert(text)
    }

    return (
        <div className="popupBack">
            <div className="popupEmpty"> </div>
            <div className="popup">
                <h1>{room.name}에 오신 것을 환영합니다.</h1>
                <p>방문록 내용</p>
                <p>{room.detail}</p>
                <p>아래의 닉네임을 입력해주시고 입장해주세요</p>
                <input id="userName"
                        className="welcomeInput"
                        type="text"
                        value={text}
                        maxLength={20}
                        onChange={handleChange}
                        placeholder="사용자 이름 입력하기"></input>
                <div>
                <button className="welcomeButton" onClick={start}> 시작하기 </button>
                {error ? <p className="error">이름을 입력해주세요!</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Welcome;