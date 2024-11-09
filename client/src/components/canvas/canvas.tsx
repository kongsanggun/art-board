import { useRef } from 'react';
import '../../App.css';
import './canvas.css'
import { Pixel } from '../../util/pixel';

const Canvas = ({ pixelData, sendHanlder }: {pixelData: Pixel, sendHanlder: any}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let pointX = -1;
    let pointY = -1;
    let prvPoint = [-1, -1];

    // 캔버스 그리기 
    const draw = (e: any) => {
        const canvas: any = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = pixelData.color;

        const leftCanvas = (e.clientX - e.target.offsetLeft + window.scrollX);
        const topCanvas = (e.clientY - e.target.offsetTop + window.scrollY);

        const rateX = (e.target.width / e.target.offsetWidth);
        const rateY = (e.target.height / e.target.offsetHeight);

        pointX = Math.floor(leftCanvas * rateX)
        pointY = Math.floor(topCanvas * rateY)

        let [x0, y0] = prvPoint;
        if (prvPoint[0] < 0) {
            [x0, y0] = [pointX, pointY]
        }

        const dx = pointX - x0;
        const dy = pointY - y0;

        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xinc = dx / steps, yinc = dy / steps;

        if (steps <= 50) {
            for (let i = 0; i < steps; i++) {
                x0 += xinc;
                y0 += yinc;
                const x1 = Math.round(x0);
                const y1 = Math.round(y0);
    
                if (pixelData.tool === "erase") {
                    ctx.clearRect(x1, y1, pixelData.brashSize, pixelData.brashSize);
                    sendHanlder(x1 + ',' + y1);
                } else {
                    ctx.fillRect(x1, y1, pixelData.brashSize, pixelData.brashSize);
                    sendHanlder(x1 + ',' + y1);
                }
            }
        }

        prvPoint = [pointX, pointY]
        if (pixelData.tool === "erase") {
            ctx.clearRect(pointX, pointY, pixelData.brashSize, pixelData.brashSize);
            sendHanlder(pointX + ',' + pointY);
        } else {
            ctx.fillRect(pointX, pointY, pixelData.brashSize, pixelData.brashSize);
            sendHanlder(pointX + ',' + pointY);
        }
    }

    // 캔버스 이동하기
    const drawMove = (e: any) => {
        if(pixelData.tool === "move") return;
        if (prvPoint[0] > 0 && prvPoint[1] > 0) {
            draw(e)
        } 
    }

    // 캔버스 포인터 떼기 
    const drawUp = (e: any) => {
        prvPoint = [-1, -1];
    }

    // 캔버스 포인터 입력하기 
    const drawDown = (e: any) => {
        if(pixelData.tool === "move") return;
        draw(e)
    }

    // 포인터가 캔버스에 떠났을 경우
    const drawLeave = (e: any) => {
        if(pixelData.tool === "move") return;
        drawUp(e)
    }

    return (
        <div className="canvasWrapper"
        onPointerDown={drawDown}
        onPointerMove={drawMove}
        onPointerUp={drawUp}
        onPointerLeave={drawLeave}
        >
            <canvas className="canvas"
                id="canvas"
                ref={canvasRef} 
                width="2048" 
                height="2048"></canvas>
        </div>
    )
}

export default Canvas;