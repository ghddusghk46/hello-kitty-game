

import React, { useState, useEffect, useRef } from "react";

import imgg1 from "./assets/images/g1.jpg";
import imgg2 from "./assets/images/g2.jpg";
import imgg3 from "./assets/images/g3.jpg";
import imgg4 from "./assets/images/g4.jpg";
import imgkitty1 from "./assets/images/kitty1.jpg";
import imgkitty2 from "./assets/images/kitty2.jpg";
import imgkitty3 from "./assets/images/kitty3.jpg";
import imgkitty4 from "./assets/images/kitty4.jpg";
import imgm1 from "./assets/images/m1.jpg";
import imgm2 from "./assets/images/m2.jpg";
import imgm3 from "./assets/images/m3.jpg";
import imgm4 from "./assets/images/m4.jpg";
import imgrr1 from "./assets/images/rr1.jpg";
import imgrr2 from "./assets/images/rr2.jpg";
import imgrr3 from "./assets/images/rr3.jpg";
import imgrr4 from "./assets/images/rr4.jpg";
import imgsj1 from "./assets/images/sj1.jpg";
import imgsj2 from "./assets/images/sj2.jpg";
import imgsj3 from "./assets/images/sj3.jpg";
import imgsj4 from "./assets/images/sj4.jpg";

import imgGLabel from "./assets/images/g_label.jpg";
import imgKittyLabel from "./assets/images/kitty_label.jpg";
import imgMLabel from "./assets/images/m_label.jpg";
import imgRrLabel from "./assets/images/rr_label.jpg";
import imgSjLabel from "./assets/images/sj_label.jpg";

const CATEGORIES = [
  { id: "g",     labelImg: imgGLabel,     name: "가나디",   color: "#ffd6f0", border: "#d060a0" },
  { id: "kitty", labelImg: imgKittyLabel, name: "헬로키티", color: "#ffb7c5", border: "#e06080" },
  { id: "m",     labelImg: imgMLabel,     name: "몬치치",   color: "#ffe0b2", border: "#e08030" },
  { id: "rr",    labelImg: imgRrLabel,    name: "리락쿠마", color: "#fff0b2", border: "#c0a000" },
  { id: "sj",    labelImg: imgSjLabel,    name: "짱구",     color: "#c8f0d8", border: "#40a060" },
];

const ITEMS = [
  { img: imgg1,     name: "가나디1", cat: "g" },
  { img: imgg2,     name: "가나디2", cat: "g" },
  { img: imgg3,     name: "가나디3", cat: "g" },
  { img: imgg4,     name: "가나디4", cat: "g" },
  { img: imgkitty1, name: "키티1",   cat: "kitty" },
  { img: imgkitty2, name: "키티2",   cat: "kitty" },
  { img: imgkitty3, name: "키티3",   cat: "kitty" },
  { img: imgkitty4, name: "키티4",   cat: "kitty" },
  { img: imgm1,     name: "몬치치1", cat: "m" },
  { img: imgm2,     name: "몬치치2", cat: "m" },
  { img: imgm3,     name: "몬치치3", cat: "m" },
  { img: imgm4,     name: "몬치치4", cat: "m" },
  { img: imgrr1,    name: "리락쿠마1", cat: "rr" },
  { img: imgrr2,    name: "리락쿠마2", cat: "rr" },
  { img: imgrr3,    name: "리락쿠마3", cat: "rr" },
  { img: imgrr4,    name: "리락쿠마4", cat: "rr" },
  { img: imgsj1,    name: "짱구1",   cat: "sj" },
  { img: imgsj2,    name: "짱구2",   cat: "sj" },
  { img: imgsj3,    name: "짱구3",   cat: "sj" },
  { img: imgsj4,    name: "짱구4",   cat: "sj" },
];

const GAME_TIME = 60;
const BELT_WIDTH = 700;
let uidCounter = 1;

export default function App() {
  const [phase, setPhase] = useState("start");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [beltItems, setBeltItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const [shake, setShake] = useState(null);
  const gameRef = useRef(null);

  const startGame = () => {
    uidCounter = 1;
    setBeltItems([]);
    setScore(0); setCombo(0); setMissed(0);
    setTimeLeft(GAME_TIME); setFeedback(null);
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const state = {
      items: [], time: GAME_TIME, spawnTimer: 0, lastTs: null,
      combo: 0, score: 0, missed: 0, dragId: null, raf: null, clockInterval: null,
      queue: [...ITEMS, ...ITEMS, ...ITEMS].sort(() => Math.random() - 0.5),
    };
    gameRef.current = state;

    state.clockInterval = setInterval(() => {
      state.time -= 1;
      setTimeLeft(state.time);
      if (state.time <= 0) {
        clearInterval(state.clockInterval);
        cancelAnimationFrame(state.raf);
        setPhase("end");
      }
    }, 1000);

    const loop = (ts) => {
      if (!state.lastTs) state.lastTs = ts;
      const dt = Math.min(ts - state.lastTs, 50);
      state.lastTs = ts;
      const speed = 1.5 + (GAME_TIME - state.time) * 0.02;
      const spawnInterval = Math.max(1000, 2000 - (GAME_TIME - state.time) * 10);
      state.spawnTimer += dt;
      if (state.spawnTimer >= spawnInterval && state.queue.length > 0) {
        state.spawnTimer = 0;
        const tmpl = state.queue.shift();
        state.items.push({ ...tmpl, uid: uidCounter++, x: -85 });
      }
      const dx = speed * dt / 16;
      state.items = state.items.map(it => ({ ...it, x: it.x + dx }));
      const lost = state.items.filter(it => it.x > BELT_WIDTH + 10 && it.uid !== state.dragId);
      if (lost.length) { state.missed += lost.length; setMissed(state.missed); }
      state.items = state.items.filter(it => it.x <= BELT_WIDTH + 10 || it.uid === state.dragId);
      setBeltItems([...state.items]);
      state.raf = requestAnimationFrame(loop);
    };
    state.raf = requestAnimationFrame(loop);
    return () => { clearInterval(state.clockInterval); cancelAnimationFrame(state.raf); gameRef.current = null; };
  }, [phase]);

  const handleDragStart = (e, item) => {
    setDragId(item.uid);
    if (gameRef.current) gameRef.current.dragId = item.uid;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, catId) => {
    e.preventDefault();
    if (!dragId || !gameRef.current) return;
    const st = gameRef.current;
    const item = st.items.find(it => it.uid === dragId);
    if (!item) return;
    const correct = item.cat === catId;
    if (correct) {
      st.combo += 1;
      const pts = 10 + (st.combo - 1) * 2;
      st.score += pts;
      setScore(st.score); setCombo(st.combo);
      setFeedback({ text: st.combo >= 2 ? `콤보 x${st.combo}! +${pts}` : `+${pts}`, color: "#e060a0" });
    } else {
      st.combo = 0; st.score = Math.max(0, st.score - 5);
      setScore(st.score); setCombo(0);
      setShake(catId); setTimeout(() => setShake(null), 400);
      setFeedback({ text: "틀렸어요! -5", color: "#e04040" });
    }
    st.items = st.items.filter(it => it.uid !== dragId);
    setBeltItems([...st.items]);
    setDragId(null); st.dragId = null; setHoverCat(null);
    setTimeout(() => setFeedback(null), 800);
  };

  const timerPct = timeLeft / GAME_TIME;
  const timerColor = timerPct > 0.5 ? "#e060a0" : timerPct > 0.25 ? "#e08030" : "#e04040";

  if (phase === "start") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:520, gap:16, fontFamily:"sans-serif", background:"#fff5f9" }}>
      <div style={{ fontSize:48 }}>🎀</div>
      <div style={{ fontSize:24, fontWeight:700, color:"#e060a0" }}>홍푸동 게임</div>
      <div style={{ fontSize:14, color:"#888", textAlign:"center", lineHeight:1.8 }}>
        컨베이어 벨트 위 캐릭터를 올바른 상자에<br/>드래그해서 분류하세요!<br/>콤보를 이어가면 보너스 점수!
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", marginTop:8 }}>
        {CATEGORIES.map(c => (
          <div key={c.id} style={{ background:c.color, border:`2px solid ${c.border}`, borderRadius:16, padding:"8px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <img src={c.labelImg} alt={c.name} style={{ width:48, height:48, borderRadius:10, objectFit:"cover" }} />
            <span style={{ fontSize:12, fontWeight:600, color:c.border }}>{c.name}</span>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ marginTop:16, background:"#e060a0", color:"white", border:"none", borderRadius:24, padding:"12px 36px", fontSize:18, fontWeight:700, cursor:"pointer" }}>
        게임 시작 🎀
      </button>
    </div>
  );

  if (phase === "end") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:520, gap:16, fontFamily:"sans-serif", background:"#fff5f9" }}>
      <div style={{ fontSize:48 }}>🎀</div>
      <div style={{ fontSize:24, fontWeight:700, color:"#e060a0" }}>게임 종료!</div>
      <div style={{ background:"#ffd6e8", border:"2px solid #e060a0", borderRadius:20, padding:"20px 48px", textAlign:"center" }}>
        <div style={{ fontSize:13, color:"#aaa" }}>최종 점수</div>
        <div style={{ fontSize:52, fontWeight:700, color:"#e060a0" }}>{score}</div>
        <div style={{ fontSize:13, color:"#bbb", marginTop:4 }}>놓친 캐릭터: {missed}개</div>
      </div>
      <div style={{ fontSize:16, color:"#e060a0" }}>
        {score >= 200 ? "🌟 완벽해요! 푸동이 만지기쿠폰!! 💕" : score >= 100 ? "노력하셈~" : "🎀 탈락 ㅉㅉ"}
      </div>
      <button onClick={startGame} style={{ background:"#e060a0", color:"white", border:"none", borderRadius:24, padding:"12px 36px", fontSize:16, fontWeight:700, cursor:"pointer" }}>
        다시 하기 🔄
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily:"sans-serif", userSelect:"none", position:"relative", background:"#fff5f9", minHeight:"100vh" }}>
      {/* 헤더 */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", background:"#ffd6e8", borderBottom:"2px solid #e060a0" }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#e060a0" }}>🎀 홍푸동 게임 🎀</div>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          {combo >= 2 && <div style={{ background:"#e060a0", color:"white", borderRadius:12, padding:"2px 10px", fontSize:12, fontWeight:600 }}>콤보 x{combo}!</div>}
          <div style={{ fontSize:12, color:"#666" }}>놓침: <b style={{ color:"#e04040" }}>{missed}</b></div>
          <div style={{ fontSize:16, fontWeight:700, color:"#e060a0" }}>점수: {score}</div>
        </div>
      </div>

      {/* 타이머 */}
      <div style={{ height:8, background:"#f0d0dc" }}>
        <div style={{ height:"100%", width:`${timerPct*100}%`, background:timerColor, transition:"width 1s linear, background 0.5s" }} />
      </div>
      <div style={{ textAlign:"center", fontSize:13, color:timerColor, fontWeight:700, padding:"2px 0" }}>{timeLeft}초</div>

      {/* 컨베이어 벨트 */}
      <div style={{ position:"relative", height:110, background:"#fff0f5", borderTop:"2px solid #f0b0c8", borderBottom:"2px solid #f0b0c8", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(224,96,160,0.07) 38px, rgba(224,96,160,0.07) 76px)" }} />
        {beltItems.map(item => (
          <div key={item.uid} draggable onDragStart={e => handleDragStart(e, item)}
            style={{
              position:"absolute", top:"50%", transform:"translateY(-50%)",
              left:item.x, width:82, height:82,
              background:"white", borderRadius:16, border:"2px solid #f0b0c8",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              cursor:"grab", opacity:item.uid === dragId ? 0.4 : 1,
              boxShadow:"0 2px 8px rgba(224,96,160,0.15)", gap:2,
            }}>
            <img src={item.img} alt={item.name} style={{ width:58, height:58, objectFit:"cover", borderRadius:10 }} />
          </div>
        ))}
      </div>

      {/* 드롭 존 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:6, padding:10 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id}
            onDragOver={e => { e.preventDefault(); setHoverCat(cat.id); }}
            onDragLeave={() => setHoverCat(null)}
            onDrop={e => handleDrop(e, cat.id)}
            style={{
              minHeight:90, borderRadius:14,
              background:hoverCat === cat.id ? cat.color : "white",
              border:`2.5px ${hoverCat === cat.id ? "solid" : "dashed"} ${cat.border}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:4, transition:"all 0.12s", cursor:"pointer",
              animation:shake === cat.id ? "shake 0.4s" : "none",
            }}>
            <img src={cat.labelImg} alt={cat.name} style={{ width:44, height:44, borderRadius:10, objectFit:"cover" }} />
            <span style={{ fontSize:11, fontWeight:600, color:cat.border }}>{cat.name}</span>
            {hoverCat === cat.id && <span style={{ fontSize:10, opacity:0.7, color:cat.border }}>여기!</span>}
          </div>
        ))}
      </div>

      {feedback && (
        <div style={{
          position:"absolute", top:160, left:"50%", transform:"translateX(-50%)",
          background:"white", border:`2px solid ${feedback.color}`,
          color:feedback.color, borderRadius:20, padding:"6px 20px",
          fontWeight:700, fontSize:16, pointerEvents:"none",
          animation:"fadeUp 0.8s ease forwards", zIndex:10,
        }}>{feedback.text}</div>
      )}

      <style>{`
        @keyframes fadeUp { 0%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-40px)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
      `}</style>
    </div>
  );
}