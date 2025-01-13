'use client'

import './page.css';

import { useRef, useState } from 'react';

import { Pixel } from '../../module/types/pixel';
import { SocketResponce } from '../../module/types/websocket';

import Welcome from '../../components/popup/welcome';
import Canvas from '../../components/canvas/canvas';
import Sidemenu from '../../components/side/sidemenu';
import ShortCut from '../../components/shortcut/shortcut';
import EnterToggle from '../../components/toggle/enterToggle';

import {boardSocket} from '../../module/websocket/websocket'
import { RoomData } from '@/app/module/types/room';
import Loading from '@/app/components/loading/loading';

export default function Room ({room}: {room: RoomData}) {
    const afterFunction = {
        enter : (responce : SocketResponce) => {
            const userList = responce.userList;
            setLoading(() => false);
            setWelcomePopup(() => false);
            setEnterToggle((value) => value + 1);
            setToggleName(userList[userList.length - 1]);
            setToggleMassage("님이 입장하셨습니다.");
            setUserList(responce.userList);
            setTimeout(() => {setEnterToggle((value) => value - 1)}, 1500);
        },
        left : (responce : SocketResponce) => {
            setEnterToggle((value) => value + 1);
            setToggleName(responce.name + "");
            setToggleMassage("님이 퇴장하셨습니다.");
            setUserList(responce.userList);
            setTimeout(() => {setEnterToggle((value) => value - 1)}, 1500);
        },
        pixel : (responce : SocketResponce) => {
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");

            if(ctx === null) return;

            for (const pixel of responce.pixelData) {
                const pointX = Number(pixel.location.split(',')[0])
                const pointY = Number(pixel.location.split(',')[1])
    
                ctx.fillStyle = pixel.color;
                ctx.fillRect(pointX, pointY, Number(pixel.brashSize), Number(pixel.brashSize));
            }
        },
        draw : (responce : SocketResponce) => {
            const data = responce.data;
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");

            if(ctx === null) return;

            const pointX = Number(data.location.split(',')[0])
            const pointY = Number(data.location.split(',')[1])

            ctx.fillStyle = data.color;
            ctx.fillRect(pointX, pointY, Number(data.brashSize), Number(data.brashSize));
        },
        clear : (responce : SocketResponce) => {
            const data = responce.data;
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");

            if(ctx === null) return;

            const pointX = Number(data.location.split(',')[0])
            const pointY = Number(data.location.split(',')[1])

            ctx.clearRect(pointX, pointY, Number(data.brashSize), Number(data.brashSize));
        },
        full : () => {
            setLoading(() => false);
            setWelcomePopup(() => true);
            setEnterToggle((value) => value + 1);
            setToggleName("방이 꽉 찼습니다.");
            setToggleMassage("");
            setTimeout(() => {setEnterToggle((value) => value - 1)}, 1500);
        }
    }

    const socket = useRef(new boardSocket(afterFunction));
    const [pixelData, setPixelData] = useState(new Pixel());
    const [userList, setUserList] = useState<string[]>([]);

    const [welcomePopup, setWelcomePopup] = useState(true);
    const [loading, setLoading] = useState(false);
    const [enterToggle, setEnterToggle] = useState(0);
    const [sideToggle, setSideToggle] = useState(false);

    const [toggleName, setToggleName] = useState('');
    const [toggleMassage, setToggleMassage] = useState('');

    const closeAction = (name: string) => {
        if(name === "" || name === null) {
            setEnterToggle((value) => value + 1);
            setToggleName("이름을 입력해주세요!");
            setToggleMassage("");
            setTimeout(() => {setEnterToggle((value) => value - 1)}, 1500);
            return;
        }

        setLoading(() => true);
        socket.current.open(name, room.id)
        window.addEventListener('mousemove', animateCursor)
    }

    const animateCursor = (e : MouseEvent) => {
        const cousor = document.querySelector('.cousor') as HTMLElement;
        if(cousor === null) return;
        cousor.style.left = `${e.clientX}px`;
        cousor.style.top = `${e.clientY}px`;
    }

    const setPixelHandler = (value : Pixel) => {
        const newPixel = value;
        setPixelData(newPixel)
    }

    const sideToggleEvent = () => {
        setSideToggle(!sideToggle)
    }

    const emitPixel = (location: string) => {
        pixelData.location = location
        socket.current.emit(pixelData)
    }

    return (
        <>
            { enterToggle > 0 ? <EnterToggle name = {toggleName} massage = {toggleMassage}/> : null }
            { loading ? <Loading/>: null}
            {
                welcomePopup ? <Welcome room = {room} onOpenAlert = {(name: string) => {closeAction(name)}}/> : 
                <div>
                    <div className="cousor"></div>
                    {
                        sideToggle 
                        ? <Sidemenu room = {room} toggleEvent = {sideToggleEvent} pixelData = {pixelData} handler = {setPixelHandler} userList = {userList}/> 
                        : <ShortCut toggleEvent = {sideToggleEvent} pixelData = {pixelData} handler = {setPixelHandler}/>
                    }
                    <Canvas pixelData = {pixelData} sendHanlder = {emitPixel}/>
                </div>  
            } 
        </>
    );
}