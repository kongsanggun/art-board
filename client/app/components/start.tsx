"use client"

import React, { useState } from "react";
import { RoomData } from "@/app/module/types/room";

const Start = ({onOpenAlert }: {onOpenAlert: (arg: RoomData) => void }) => {

  const [room, setRoom] = useState<RoomData>({
    id: '',
    name: '',
    detail: '',
    limitUser: 4,
    pixelData: '[]'
  });

  const makeRoom = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    onOpenAlert(room);
  }

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>방 생성</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="방 이름을 입력하세요"
            onChange={e => setRoom(prev => ({ ...prev, name: e.target.value } as RoomData))}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="description">설명</label>
          <textarea
            id="detail"
            name="detail"
            placeholder="방 설명을 입력하세요"
            rows={4}
            onChange={e => setRoom(prev => ({ ...prev, detail: e.target.value } as RoomData))}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="maxUsers">최대 인원</label>
          <input
            id="limitUser"
            name="limitUser"
            type="number"
            min={1}
            max={100}
            defaultValue={4}
            onChange={e => setRoom(
              prev => (
                {
                  ...prev,
                  limitUser: Number(e.target.value)
                } as RoomData)
            )
            }
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button onClick={makeRoom}>방 생성</button>
      </form>
    </main>
  );
}

export default Start;