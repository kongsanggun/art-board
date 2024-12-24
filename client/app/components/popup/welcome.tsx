"use client"

import React, { useState } from "react";
import { RoomData } from "@/app/module/types/room";

import './welcome.css';

const Welcome = ({ room, onOpenAlert }: { room: RoomData, onOpenAlert: (arg: string) => void}) => {
    const [text, setText] = useState('');

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const start = () => {
        onOpenAlert(text)
    }

    return (
        <div className="popupBack">
            <div className="popupEmpty"> </div>
            <div className="popup">
                <div className="title">{room.name}의 방명록</div>
                <div className="detail" dangerouslySetInnerHTML={{__html: room.detail}}/>
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
                <button className="welcomeButton" onClick={start}> 시작하기 </button>
                </div>
            </div>
        </div>
    )
}

export default Welcome;