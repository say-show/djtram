"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentMode, TramMode, MODES } from "@/lib/modeUtils";
import WaveAnimation from "./WaveAnimation";

const MODE_LIST = Object.values(MODES);
const TRACK_INTERVAL_MS = 20_000;
const MIN_LISTENERS = 5;
const MAX_LISTENERS = 12;

// リスナー数 (5〜12) → リング数 (2〜5)
function calcRingCount(count: number): number {
  return Math.round((count - MIN_LISTENERS) / (MAX_LISTENERS - MIN_LISTENERS) * 3) + 2;
}

export default function PlayScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<TramMode>(MODES["boot-up"]);
  const [hasAudio, setHasAudio] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  // SSR対策: 初期値固定、マウント後にランダム化
  const [listenerCount, setListenerCount] = useState(8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMode(getCurrentMode());
  }, []);

  // マウント後にリスナー数をランダム初期化
  useEffect(() => {
    setListenerCount(
      Math.floor(MIN_LISTENERS + Math.random() * (MAX_LISTENERS - MIN_LISTENERS + 1))
    );
  }, []);

  // 30秒ごとに ±1〜2 変動
  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = (Math.floor(Math.random() * 2) + 1) * (Math.random() < 0.5 ? 1 : -1);
        return Math.min(MAX_LISTENERS, Math.max(MIN_LISTENERS, prev + delta));
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(mode.audioFile, { method: "HEAD" })
      .then((res) => setHasAudio(res.ok))
      .catch(() => setHasAudio(false));
  }, [mode]);

  useEffect(() => {
    setTrackIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = mode.audioFile;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTrackIndex((i) => (i + 1) % mode.setlist.length);
    }, TRACK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPlaying, mode]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const currentTrack = mode.setlist[trackIndex];
  const ringCount = calcRingCount(listenerCount);

  // リスナー数に応じてグロウ強度を変化（5人: 薄め、12人: 強め）
  const glowIntensity = (listenerCount - MIN_LISTENERS) / (MAX_LISTENERS - MIN_LISTENERS);
  const glowShadow = isPlaying
    ? `0 0 ${20 + glowIntensity * 20}px ${mode.color}${Math.round(40 + glowIntensity * 60).toString(16)}, 0 0 ${60 + glowIntensity * 60}px ${mode.color}${Math.round(20 + glowIntensity * 40).toString(16)}`
    : `0 0 10px ${mode.color}22`;

  return (
    <div className="flex flex-col select-none px-6 pt-6 pb-4"
      style={{ height: "calc(100vh - 80px)" }}>

      {/* 音源未準備バナー */}
      <AnimatePresence>
        {!hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="w-full mb-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white/40 flex-shrink-0"
          >
            音源未準備 — UIデモモード
          </motion.div>
        )}
      </AnimatePresence>

      {/* ロゴ */}
      <p className="text-xs tracking-[0.4em] text-white/30 font-bold mb-2 text-center flex-shrink-0">GLIDE</p>

      {/* モード表示 */}
      <AnimatePresence mode="wait">
        <motion.div key={mode.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} className="text-center mb-4 flex-shrink-0">
          <h1 className="text-2xl font-black tracking-widest"
            style={{ color: mode.color, textShadow: `0 0 20px ${mode.color}88` }}>
            {mode.label}
          </h1>
          <p className="text-white/40 text-xs mt-0.5 tracking-wider">{mode.sublabel}</p>
        </motion.div>
      </AnimatePresence>

      {/* メインPlayボタン + リスナーリング */}
      <div className="relative flex items-center justify-center mb-4 flex-shrink-0">
        {/* リスナー数に応じたパルスリング */}
        <AnimatePresence>
          {isPlaying && Array.from({ length: ringCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: `${mode.color}${Math.round(50 - i * 8).toString(16).padStart(2, "0")}`,
                width: 136,
                height: 136,
              }}
              animate={{ scale: [1, 1.15 + i * 0.12], opacity: [0.55 - i * 0.08, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: i * 0.45 }}
            />
          ))}
        </AnimatePresence>

        <motion.button onClick={togglePlay} whileTap={{ scale: 0.93 }}
          className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${mode.color}33, ${mode.color}11)`,
            border: `2px solid ${mode.color}88`,
            boxShadow: glowShadow,
          }}>
          <AnimatePresence mode="wait">
            <motion.span key={isPlaying ? "pause" : "play"}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              {isPlaying ? (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="8" y="7" width="7" height="22" rx="2" fill={mode.color} />
                  <rect x="21" y="7" width="7" height="22" rx="2" fill={mode.color} />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M11 8L29 18L11 28V8Z" fill={mode.color} />
                </svg>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* リスナー数ラベル（ボタン下に小さく） */}
        <div className="absolute -bottom-5 text-center">
          <p className="text-[9px] tracking-widest" style={{ color: `${mode.color}66` }}>
            {listenerCount} LISTENING
          </p>
        </div>
      </div>

      {/* 波形 */}
      <div className="mb-4 mt-2 flex-shrink-0">
        <WaveAnimation isPlaying={isPlaying} color={mode.color} />
      </div>

      {/* ━━━ SETLIST ━━━ */}
      <div className="flex-1 flex flex-col min-h-0 mb-4">
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <p className="text-[10px] tracking-[0.3em] text-white/30">SETLIST</p>
          <p className="text-[10px] text-white/20">{mode.genre}</p>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 min-h-0">
          {mode.setlist.map((track, i) => {
            const isCurrent = i === trackIndex;
            return (
              <div key={i}
                onClick={() => setTrackIndex(i)}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-300 active:opacity-70"
                style={{
                  background: isCurrent ? `${mode.color}0d` : "transparent",
                  borderLeft: isCurrent ? `2px solid ${mode.color}` : "2px solid transparent",
                }}>
                <span className="text-[10px] font-bold w-5 flex-shrink-0"
                  style={{ color: isCurrent ? mode.color : "#ffffff22" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate"
                    style={{ color: isCurrent ? "#ffffff" : "#ffffff44" }}>
                    {track.title}
                  </p>
                  <p className="text-[10px] truncate"
                    style={{ color: isCurrent ? `${mode.color}99` : "#ffffff22" }}>
                    {track.artist}
                  </p>
                </div>
                <span className="text-[10px] flex-shrink-0"
                  style={{ color: isCurrent ? `${mode.color}cc` : "#ffffff22" }}>
                  {track.bpm} BPM
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
            <button key={m.id} onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all duration-300"
              style={{
                background: mode.id === m.id ? `${m.color}22` : "transparent",
                border: `1px solid ${mode.id === m.id ? m.color : "#ffffff22"}`,
                color: mode.id === m.id ? m.color : "#ffffff44",
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={mode.audioFile} loop
        onCanPlay={() => setHasAudio(true)} onError={() => setHasAudio(false)} />
    </div>
  );
}
