"use client"

import React, { useState } from "react";
import { RoomData } from "@/app/module/types/room";

import './welcome.css';

const Welcome = ({ room, onOpenAlert }: { room: RoomData, onOpenAlert: (arg: string) => void}) => {
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
                <h1>{room.name}의 방명록</h1>
                <div className="detail">
                    {room.detail}
                </div>
                <div className="inputDiv">
                    <p><b>닉네임</b>을 입력해주세요.</p>
                    <input id="userName"
                        className="welcomeInput"
                        type="text"
                        value={text}
                        maxLength={20}
                        onChange={handleChange}
                        placeholder="사용자 이름"></input>
                </div>

                <div>
                {error ? <p className="error">이름을 입력해주세요!</p> : <p className="error"> </p>}
                <button className="welcomeButton" onClick={start}> 시작하기 </button>
                </div>
            </div>
        </div>
    )
}

export default Welcome;