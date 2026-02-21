"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrentMode, TramMode, MODES } from "@/lib/modeUtils";
import { TRAM_STOPS } from "@/lib/tramStops";
import WaveAnimation from "@/components/WaveAnimation";

const MODE_LIST = Object.values(MODES);

type Reactions = {
  good: number;
  vibe: number;
  fire: number;
};

export default function DJDashboard() {
  const [mode, setMode] = useState<TramMode>(() => MODES["boot-up"]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [listenerCount, setListenerCount] = useState(8);
  const [reactions, setReactions] = useState<Reactions>({ good: 0, vibe: 0, fire: 0 });
  const [stopIndex, setStopIndex] = useState(0);
  const [liveFlash, setLiveFlash] = useState(true);

  // 起動時に現在時刻のモードを設定（SSR対策でuseEffect内）
  useEffect(() => {
    setMode(getCurrentMode());
  }, []);

  // モード切り替え時にトラックをリセット
  const handleModeChange = (m: TramMode) => {
    setMode(m);
    setTrackIndex(0);
  };

  // LIVE点滅: 1秒ごと
  useEffect(() => {
    const id = setInterval(() => setLiveFlash((f) => !f), 1000);
    return () => clearInterval(id);
  }, []);

  // リスナー数変動: 30秒ごとに ±1〜2（5〜15人の範囲）
  useEffect(() => {
    const id = setInterval(() => {
      setListenerCount((count) => {
        const delta =
          Math.random() < 0.5
            ? -(Math.floor(Math.random() * 2) + 1)
            : Math.floor(Math.random() * 2) + 1;
        return Math.min(15, Math.max(5, count + delta));
      });
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // リアクション増加: 8〜15秒ごとにランダムな種類へ +1〜3
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      timeoutId = setTimeout(() => {
        const keys: (keyof Reactions)[] = ["good", "vibe", "fire"];
        const key = keys[Math.floor(Math.random() * keys.length)];
        const amount = Math.floor(Math.random() * 3) + 1;
        setReactions((r) => ({ ...r, [key]: r[key] + amount }));
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  // 停留所: 7秒ごとに次へ（13駅ループ）
  useEffect(() => {
    const id = setInterval(() => {
      setStopIndex((i) => (i + 1) % TRAM_STOPS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const track = mode.setlist[trackIndex];
  const currentStop = TRAM_STOPS[stopIndex];

  return (
    <div
      className="flex flex-col select-none px-4 pt-4 pb-4"
      style={{ height: "100dvh" }}
    >
      {/* ヘッダー */}
      <header
        className="flex items-center justify-between pb-3 mb-3 border-b flex-shrink-0"
        style={{ borderColor: mode.color + "40" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              color: liveFlash ? "#00E5FF" : "transparent",
              fontSize: "10px",
              transition: "color 0.15s",
            }}
          >
            ●
          </span>
          <span className="text-xs font-bold tracking-widest text-white/50">LIVE</span>
        </div>
        <span className="text-xs font-bold tracking-[0.3em] text-white/70">
          GLIDE DJ MONITOR
        </span>
        <span className="text-white/20 text-sm">▸</span>
      </header>

      {/* モード表示 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-center mb-3 flex-shrink-0"
        >
          <h1
            className="text-2xl font-black tracking-widest"
            style={{ color: mode.color, textShadow: `0 0 20px ${mode.color}88` }}
          >
            {mode.label}
          </h1>
          <p className="text-white/40 text-xs mt-0.5 tracking-wider">
            {mode.sublabel} — {mode.genre}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* NOW PLAYING */}
      <div className="mb-3 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode.id}-${trackIndex}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            <p className="text-base font-bold text-white truncate">{track.title}</p>
            <p className="text-xs mb-2" style={{ color: mode.color + "99" }}>
              {track.artist} — {track.bpm} BPM
            </p>
          </motion.div>
        </AnimatePresence>
        <WaveAnimation isPlaying={true} color={mode.color} />
      </div>

      {/* 統計エリア: LISTENERS + REACTIONS（2列・大型表示） */}
      <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
        {/* LISTENERS */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-[9px] font-bold tracking-widest text-white/30 mb-1">LISTENERS</p>
          <motion.p
            key={listenerCount}
            initial={{ scale: 1.3, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-black leading-none"
            style={{ color: mode.color, textShadow: `0 0 24px ${mode.color}80` }}
          >
            {listenerCount}
          </motion.p>
          <p className="text-[9px] text-white/20 mt-1 tracking-widest">PEOPLE</p>
        </div>

        {/* REACTIONS */}
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-[9px] font-bold tracking-widest text-white/30 mb-2">REACTIONS</p>
          <div className="flex flex-col gap-1.5">
            {(
              [
                { emoji: "👍", count: reactions.good },
                { emoji: "🌊", count: reactions.vibe },
                { emoji: "🔥", count: reactions.fire },
              ] as const
            ).map(({ emoji, count }) => (
              <div key={emoji} className="flex items-center justify-between">
                <span className="text-xl leading-none">{emoji}</span>
                <motion.span
                  key={count}
                  initial={{ scale: 1.4, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-black font-mono"
                  style={{ color: mode.color }}
                >
                  {count}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CURRENT STOP（コンパクト横帯） */}
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl mb-3 flex-shrink-0"
        style={{ background: `${mode.color}10`, border: `1px solid ${mode.color}30` }}
      >
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold tracking-widest text-white/30 block mb-0.5">
            CURRENT STOP
          </span>
          <span className="text-sm font-bold truncate block" style={{ color: mode.color }}>
            {currentStop.name}
          </span>
        </div>
        {/* ミニ路線図 */}
        <div className="flex items-center gap-x-0.5 flex-shrink-0">
          {TRAM_STOPS.map((stop, i) => (
            <span
              key={stop.id}
              style={{
                color: i === stopIndex ? mode.color : "rgba(255,255,255,0.15)",
                fontSize: i === stopIndex ? "8px" : "5px",
                transition: "all 0.4s ease",
                lineHeight: 1,
              }}
            >
              ●
            </span>
          ))}
        </div>
      </div>

      {/* ━━━ SETLIST ━━━ */}
      <div className="flex-1 flex flex-col min-h-0 mb-3">
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <p className="text-[10px] tracking-[0.3em] text-white/30">SETLIST</p>
          <p className="text-[10px] text-white/20">{mode.genre}</p>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 min-h-0">
          {mode.setlist.map((t, i) => {
            const isCurrent = i === trackIndex;
            return (
              <div
                key={i}
                onClick={() => setTrackIndex(i)}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-300 active:opacity-70"
                style={{
                  background: isCurrent ? `${mode.color}0d` : "transparent",
                  borderLeft: isCurrent
                    ? `2px solid ${mode.color}`
                    : "2px solid transparent",
                }}
              >
                <span
                  className="text-[10px] font-bold w-5 flex-shrink-0"
                  style={{ color: isCurrent ? mode.color : "#ffffff22" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: isCurrent ? "#ffffff" : "#ffffff44" }}
                  >
                    {t.title}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{ color: isCurrent ? `${mode.color}99` : "#ffffff22" }}
                  >
                    {t.artist}
                  </p>
                </div>
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{ color: isCurrent ? `${mode.color}cc` : "#ffffff22" }}
                >
                  {t.bpm} BPM
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* モード切り替え */}
      <div className="flex-shrink-0">
        <p className="text-[10px] tracking-[0.3em] text-white/30 mb-2">MODE</p>
        <div className="flex gap-2">
          {MODE_LIST.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m)}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all duration-300"
              style={{
                background: mode.id === m.id ? `${m.color}22` : "transparent",
                border: `1px solid ${mode.id === m.id ? m.color : "#ffffff22"}`,
                color: mode.id === m.id ? m.color : "#ffffff44",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
