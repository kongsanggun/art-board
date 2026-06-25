/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { RoomData } from "@/app/module/types/room";

// ── 2. 방 카드 ───────────────────────────────────────────────

function RoomCard({ room, onEnter }: any) {
    const [hover, setHover] = useState(false);
    const pct = Math.min(100, Math.round((room.currentUsers / room.limitUser) * 100));
    const full = room.currentUsers >= room.limitUser;

    return (
        <div
            onClick={() => !full && onEnter(room.id)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                border: `1.5px solid ${hover && !full ? "#6B2FFA" : "rgba(26,10,60,0.07)"}`,
                borderRadius: 16,
                padding: "16px 16px 14px",
                cursor: full ? "not-allowed" : "pointer",
                transition: "border-color .15s, box-shadow .15s, transform .15s",
                transform: hover && !full ? "translateY(-2px)" : "none",
                boxShadow:
                    hover && !full
                        ? "0 8px 28px rgba(107,47,250,0.13)"
                        : "0 1px 3px rgba(26,10,60,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: full ? 0.72 : 1,
            }}
        >
            {/* 미리보기 + 정보 */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 6,
                            marginBottom: 5,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1A0A3C",
                                lineHeight: 1.3,
                            }}
                        >
                            {room.name}
                        </span>
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                color: full ? "#C05621" : "#276749",
                                background: full ? "#FFF3E8" : "#DCFCE7",
                                padding: "2px 8px",
                                borderRadius: 20,
                            }}
                        >
                            {room.currentUsers}/{room.limitUser}
                        </span>
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#7B6FA0",
                            lineHeight: 1.55,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontStyle: room.detail ? "normal" : "italic",
                        }}
                    >
                        {room.detail
                            ? room.detail.replace(/^#+\s*/gm, "")
                            : "소개 없음"}
                    </p>
                </div>
            </div>

            {/* 점유율 바 */}
            <div
                style={{ height: 3, background: "rgba(107,47,250,0.08)", borderRadius: 99 }}
            >
                <div
                    style={{
                        height: "100%",
                        borderRadius: 99,
                        width: `${pct}%`,
                        background: pct >= 90 ? "#FF6B35" : "#6B2FFA",
                        transition: "width .5s ease",
                    }}
                />
            </div>

            {/* 입장 버튼 (hover 시 표시) */}
            <div
                style={{
                    overflow: "hidden",
                    maxHeight: hover ? 40 : 0,
                    opacity: hover ? 1 : 0,
                    transition: "max-height .15s, opacity .15s",
                }}
            >
                <button
                    style={{
                        width: "100%",
                        padding: "9px",
                        background: full ? "#94A3B8" : "#6B2FFA",
                        border: "none",
                        borderRadius: 9,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: full ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {full ? "정원이 꽉 찼어요" : "입장하기 →"}
                </button>
            </div>
        </div>
    );
}

// ── 3. 방 만들기 모달 ────────────────────────────────────────

function CreateModal({ onClose, onCreate, busy }: any) {
    const [form, setForm] = useState({
        name: "",
        detail: "",
        limitUser: 20,
    });
    const [errs, setErrs] = useState<any>({});

    const upd = (k: any, v: any) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrs((p: any) => ({ ...p, [k]: null }));
    };

    // const baseInput = (hasErr: any) => ({
    //   width: "100%",
    //   boxSizing: "border-box",
    //   padding: "9px 12px",
    //   fontSize: 14,
    //   border: `1.5px solid ${hasErr ? "#FC8181" : "rgba(26,10,60,0.11)"}`,
    //   borderRadius: 9,
    //   background: "#F8F5FF",
    //   color: "#1A0A3C",
    //   outline: "none",
    //   fontFamily: "inherit",
    // });

    const submit = () => {
        const e: any = {};
        if (!form.name.trim()) e.name = "방 이름을 입력해주세요";
        if (Object.keys(e).length) {
            setErrs(e);
            return;
        }
        onCreate(form);
    };

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
                background: "rgba(26,10,60,0.42)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "40px 16px",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "28px 26px 24px",
                    width: "100%",
                    maxWidth: 420,
                    boxShadow: "0 24px 64px rgba(107,47,250,0.18)",
                }}
            >
                {/* 헤더 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 22,
                    }}
                >
                    <h2
                        style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#1A0A3C" }}
                    >
                        새 방 만들기
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(26,10,60,0.06)",
                            cursor: "pointer",
                            fontSize: 14,
                            color: "#7B6FA0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* 방 이름 */}
                <div style={{ marginBottom: 15 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1A0A3C",
                            marginBottom: 5,
                        }}
                    >
                        방 이름 <span style={{ color: "#6B2FFA" }}>*</span>
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => upd("name", e.target.value)}
                        placeholder="봄 방문록"
                    />
                    {errs.name && (
                        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#E53E3E" }}>
                            {errs.name}
                        </p>
                    )}
                </div>

                {/* 방 소개 */}
                <div style={{ marginBottom: 15 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1A0A3C",
                            marginBottom: 5,
                        }}
                    >
                        방 소개{" "}
                        <span
                            style={{ fontSize: 12, fontWeight: 400, color: "#9B8FC0" }}
                        >
                            (선택)
                        </span>
                    </label>
                    <textarea
                        value={form.detail}
                        onChange={(e) => upd("detail", e.target.value)}
                        placeholder="방에 대한 소개를 작성해주세요..."
                        rows={2}
                    />
                </div>

                {/* 최대 인원 */}
                <div style={{ marginBottom: 24 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 7,
                        }}
                    >
                        <label
                            style={{ fontSize: 13, fontWeight: 500, color: "#1A0A3C" }}
                        >
                            최대 인원
                        </label>
                        <span
                            style={{ fontSize: 15, fontWeight: 700, color: "#6B2FFA" }}
                        >
                            {form.limitUser}명
                        </span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="100"
                        step="2"
                        value={form.limitUser}
                        onChange={(e) => upd("limitUser", Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#6B2FFA", cursor: "pointer" }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 11,
                            color: "#9B8FC0",
                            marginTop: 3,
                        }}
                    >
                        <span>2명</span>
                        <span>100명</span>
                    </div>
                </div>

                <button
                    onClick={submit}
                    disabled={busy}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: busy ? "#A78BFA" : "#6B2FFA",
                        border: "none",
                        borderRadius: 11,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: busy ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {busy ? "생성 중…" : "방 만들기"}
                </button>
            </div>
        </div>
    );
}

// ── 4. 스켈레톤 로더 ─────────────────────────────────────────

function Skeleton() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                gap: 14,
            }}
        >
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        height: 172,
                        borderRadius: 16,
                        background: `rgba(107,47,250,${0.04 + i * 0.01})`,
                        border: "1.5px solid rgba(26,10,60,0.05)",
                    }}
                />
            ))}
        </div>
    );
}

export default function Page() {
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [busy, setBusy] = useState(false);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<any>(null);

    // 방 목록 불러오기
    useEffect(() => {
        fetch(`/api/room`)
            .then((r) => r.json())
            .then(setRooms)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const notify = (msg: string, err = false) => {
        setToast({ msg, err } as any);
        setTimeout(() => setToast(null), 2800);
    };

    // 방 만들기
    const handleCreate = async (form: { name: any; }) => {
        setBusy(true);
        try {
            const data = await fetch(`/api/room`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            }).then((data) => {
                if (!data.ok) {
                    throw new Error("Failed to create room");
                }
                return data.json()
            });
            setShowCreate(false);
            notify(`"${data.name}" 방이 만들어졌어요 🎨`);
            await new Promise(() => setTimeout(() => {
                handleEnter(data.id);
            }, 800));
        } catch {
            notify("방 생성에 실패했어요. 다시 시도해주세요.", true);
        } finally {
            setBusy(false);
        }
    };

    // 방 입장
    const handleEnter = (id: any) => {
        // ─── Production ─────────────────────────────────────────
        redirect(`/room/${id}`);
    };

    // 검색 필터
    const filtered = rooms.filter(
        (r: any) => r.name.includes(search)
    );

    const stats = {
        total: rooms.length,
        active: rooms.filter((r: any) => r.currentUsers > 0).length,
        online: rooms.reduce((s: any, r: any) => s + r.currentUsers, 0),
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                background: "#F0EDF8",
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: "#1A0A3C",
            }}
        >
            {/* ── 헤더 ── */}
            <header
                style={{
                    padding: "18px 24px",
                    background: "rgba(255,255,255,0.9)",
                    borderBottom: "1px solid rgba(107,47,250,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "#6B2FFA",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            flexShrink: 0,
                        }}
                    >
                        🎨
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: "#1A0A3C",
                                letterSpacing: -0.3,
                                lineHeight: 1,
                            }}
                        >
                            art·board
                        </div>
                        <div
                            style={{ fontSize: 11, color: "#9B8FC0", marginTop: 2 }}
                        >
                            방문록을 그리세요
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "9px 16px",
                        background: "#6B2FFA",
                        border: "none",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        flexShrink: 0,
                    }}
                >
                    <span style={{ fontSize: 17, lineHeight: 1, marginTop: -1 }}>+</span>{" "}
                    새 방
                </button>
            </header>

            {/* ── 메인 콘텐츠 ── */}
            <main
                style={{ padding: "24px 20px 48px", maxWidth: 820, margin: "0 auto" }}
            >
                {/* 통계 */}
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: 22,
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        { label: "전체 방", value: stats.total, hi: false },
                        { label: "활성 방", value: stats.active, hi: true },
                        { label: "현재 접속자", value: `${stats.online}명`, hi: false },
                    ].map((s) => (
                        <div
                            key={s.label}
                            style={{
                                background: "#fff",
                                border: `1px solid ${s.hi ? "rgba(107,47,250,0.18)" : "rgba(26,10,60,0.06)"
                                    }`,
                                borderRadius: 12,
                                padding: "10px 18px",
                                flex: "1 1 90px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: s.hi ? "#6B2FFA" : "#1A0A3C",
                                    lineHeight: 1,
                                }}
                            >
                                {s.value}
                            </div>
                            <div
                                style={{ fontSize: 11, color: "#9B8FC0", marginTop: 3 }}
                            >
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 검색창 */}
                <div style={{ position: "relative", marginBottom: 18 }}>
                    <span
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 15,
                            color: "#9B8FC0",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    >
                        🔍
                    </span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="방 이름, ID, 소개로 검색..."
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px 14px 11px 36px",
                            fontSize: 14,
                            border: "1.5px solid rgba(26,10,60,0.08)",
                            borderRadius: 12,
                            background: "#fff",
                            color: "#1A0A3C",
                            outline: "none",
                            fontFamily: "inherit",
                        }}
                    />
                </div>

                {/* 방 그리드 / 빈 상태 / 로딩 */}
                {loading ? (
                    <Skeleton />
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ fontSize: 44, marginBottom: 12 }}>🎨</div>
                        <p
                            style={{ margin: "0 0 16px", color: "#7B6FA0", fontSize: 15 }}
                        >
                            {search
                                ? `"${search}" 검색 결과가 없어요`
                                : "아직 방이 없어요"}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setShowCreate(true)}
                                style={{
                                    padding: "10px 22px",
                                    background: "#6B2FFA",
                                    border: "none",
                                    borderRadius: 10,
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                첫 번째 방 만들기
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {search && (
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "#9B8FC0",
                                    marginBottom: 12,
                                }}
                            >
                                {filtered.length}개의 방을 찾았어요
                            </p>
                        )}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))",
                                gap: 14,
                            }}
                        >
                            {filtered.map((room: any) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onEnter={handleEnter}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* ── 방 만들기 모달 ── */}
            {showCreate && (
                <CreateModal
                    onClose={() => setShowCreate(false)}
                    onCreate={handleCreate}
                    busy={busy}
                />
            )}

            {/* ── 토스트 알림 ── */}
            {toast && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: toast.err ? "#C53030" : "#1A0A3C",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "11px 20px",
                        fontSize: 13.5,
                        fontWeight: 500,
                        zIndex: 200,
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    }}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    );
}