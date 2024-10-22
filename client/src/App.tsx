import { useEffect, useRef, useState } from 'react';
import './App.css';

import Topmenu from './components/top/topmenu';
import Sidemenu from './components/side/sidemenu';
import Canvas from './components/canvas/canvas';
import Footer from './components/footer';
import Welcome from './components/popup/welcome';
import { Pixel } from './util/pixel';

import { Socket, io } from 'socket.io-client';

function App() {

    const socket = useRef<Socket| null>(null);

    const startSocket = (name : any) => {
        setWelcome(false)
        setUserName(name)

        socket.current = io(process.env.REACT_APP_URL, 
            {
                transports: ['websocket'], 
                autoConnect: false,
            });
        socket.current.open();
        socket.current.on("connect", () => {
            socket.current?.emit("enter", name);
        });

        socket.current.on("enter", (data) => {
            setUserList(data.userList);
        })

        socket.current.on("left", (data) => {
            setUserList(data.userList);
        })

        socket.current.on("pixel", (data) => {
            const canvas: any = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");

            for (const pixel of data.pixelData) {
                const pointX = pixel.location.split(',')[0]
                const pointY = pixel.location.split(',')[1]
    
                ctx.fillStyle = pixel.RGB;
                ctx.fillRect(pointX, pointY, pixel.brashSize, pixel.brashSize);
            }
        })

        socket.current.on("draw", (data) => {
            const canvas: any = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");

            const pointX = data.data.location.split(',')[0]
            const pointY = data.data.location.split(',')[1]

            ctx.fillStyle = data.data.RGB;
            ctx.fillRect(pointX, pointY, data.data.brashSize, data.data.brashSize);
        })

        socket.current.on("clear", (data) => {
            const canvas: any = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");

            const pointX = data.data.location.split(',')[0]
            const pointY = data.data.location.split(',')[1]

            ctx.clearRect(pointX, pointY, data.data.brashSize, data.data.brashSize);
        })
    }

    useEffect(() => {
        setWelcome(true)
    }, [])

    const cousor = document.querySelector('.cousor') as HTMLElement;
    const animateCursor = (e : any) => {
        if(cousor === null) return;
        cousor.style.left = `${e.clientX}px`;
        cousor.style.top = `${e.clientY}px`;
    }
    window.addEventListener('mousemove', animateCursor);

    const [userName, setUserName] = useState('');
    const [welcome, setWelcome] = useState(true);
    const [userList, setUserList] = useState<String[]>([]);
    const [pixelData, setPixelData] = useState(new Pixel());

    const setPixelHandler = (key : string, value : any) => {
        const newPixel = pixelData

        switch (key) {
            case "brashSize" :
                newPixel.brashSize = value
                break;
            case "eraseCheck" :
                newPixel.eraseCheck = !newPixel.eraseCheck
                break;
            case "color" :
                newPixel.color = value
                break;
        }

        setPixelData(newPixel)
    }

    const sendHanlder = (location : string) => {
        if (socket.current?.active) {
            const massge = pixelData.eraseCheck ? "clear" : "draw";
            const param = {
                "RGB": pixelData.color,
                "location": location,
                "user": userName,
                "brashSize": pixelData.brashSize,
                "timestamp": "null"
            };
            socket.current?.emit(massge, param);
        }
    }

    return (
        <>
            {welcome ? <Welcome onOpenAlert = {startSocket}/> : null}
            <div className = {welcome ? 'blur' : ''}>
                <div className="cousor"></div>
                <div className='pageTitle'>
                    <h1>사이버 방문록</h1>
                </div>
                <Topmenu handler = {setPixelHandler}/>

                <div className='pageMain'>
                    <Canvas pixelData = {pixelData} sendHanlder = {sendHanlder}/>
                    <Sidemenu userList = {userList}/>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default App;
