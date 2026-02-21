"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentMode, TramMode, MODES } from "@/lib/modeUtils";
import WaveAnimation from "./WaveAnimation";

const MODE_LIST = Object.values(MODES);
// 再生中に20秒ごとに次の曲へ進む
const TRACK_INTERVAL_MS = 20_000;

export default function PlayScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<TramMode>(MODES["boot-up"]);
  const [hasAudio, setHasAudio] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  // クライアント側の時刻で初期モードを設定
  useEffect(() => {
    setMode(getCurrentMode());
  }, []);

  // 音源ファイルの存在確認
  useEffect(() => {
    fetch(mode.audioFile, { method: "HEAD" })
      .then((res) => setHasAudio(res.ok))
      .catch(() => setHasAudio(false));
  }, [mode]);

  // モード変更時: 再生切り替え & トラックリセット
  useEffect(() => {
    setTrackIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = mode.audioFile;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 再生中のみ20秒ごとに次のトラックへ
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTrackIndex((i) => (i + 1) % mode.setlist.length);
    }, TRACK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPlaying, mode]);

  // トラック変更時にスクロール追随
  useEffect(() => {
    trackRefs.current[trackIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [trackIndex]);

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

  return (
    <div className="flex flex-col items-center px-6 pt-12 pb-4 select-none overflow-y-auto"
      style={{ minHeight: "calc(100vh - 80px)" }}>

      {/* 音源未準備バナー */}
      <AnimatePresence>
        {!hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white/40"
          >
            音源未準備 — UIデモモード
          </motion.div>
        )}
      </AnimatePresence>

      {/* ロゴ */}
      <p className="text-xs tracking-[0.4em] text-white/30 font-bold mb-2">GLIDE</p>

      {/* モード表示 */}
      <AnimatePresence mode="wait">
        <motion.div key={mode.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-widest"
            style={{ color: mode.color, textShadow: `0 0 20px ${mode.color}88` }}>
            {mode.label}
          </h1>
          <p className="text-white/40 text-xs mt-1 tracking-wider">{mode.sublabel}</p>
        </motion.div>
      </AnimatePresence>

      {/* メインPlayボタン */}
      <div className="relative flex items-center justify-center mb-6">
        {isPlaying && (
          <>
            <motion.div className="absolute rounded-full border"
              style={{ borderColor: `${mode.color}44`, width: 160, height: 160 }}
              animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
            <motion.div className="absolute rounded-full border"
              style={{ borderColor: `${mode.color}33`, width: 160, height: 160 }}
              animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }} />
          </>
        )}
        <motion.button onClick={togglePlay} whileTap={{ scale: 0.93 }}
          className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${mode.color}33, ${mode.color}11)`,
            border: `2px solid ${mode.color}88`,
            boxShadow: isPlaying ? `0 0 30px ${mode.color}66, 0 0 80px ${mode.color}33` : `0 0 10px ${mode.color}22`,
          }}>
          <AnimatePresence mode="wait">
            <motion.span key={isPlaying ? "pause" : "play"}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="text-4xl select-none" style={{ color: mode.color }}>
              {isPlaying ? "⏸" : "▶"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 波形 */}
      <div className="mb-6">
        <WaveAnimation isPlaying={isPlaying} color={mode.color} />
      </div>

      {/* ━━━ SETLIST ━━━ */}
      <div className="w-full mb-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-[0.3em] text-white/30">SETLIST</p>
          <p className="text-[10px] text-white/20">{mode.genre}</p>
        </div>

        {/* 現在の曲（大きく表示） */}
        <AnimatePresence mode="wait">
          <motion.div key={`${mode.id}-${trackIndex}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="w-full rounded-2xl p-4 mb-3 flex items-center gap-4"
            style={{ background: `${mode.color}12`, border: `1px solid ${mode.color}44` }}>
            {/* ミニ波形 */}
            <div className="flex-shrink-0">
              <WaveAnimation isPlaying={isPlaying} color={mode.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base truncate">{currentTrack.title}</p>
              <p className="text-white/50 text-xs mt-0.5 truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-[10px] font-bold" style={{ color: mode.color }}>{currentTrack.bpm}</p>
              <p className="text-[9px] text-white/30">BPM</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 全曲リスト */}
        <div className="space-y-0 rounded-xl overflow-hidden border border-white/5">
          {mode.setlist.map((track, i) => {
            const isCurrent = i === trackIndex;
            const isPast = i < trackIndex;
            return (
              <div key={i} ref={(el) => { trackRefs.current[i] = el; }}
                onClick={() => setTrackIndex(i)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 active:opacity-70"
                style={{ background: isCurrent ? `${mode.color}0d` : "transparent",
                  borderLeft: isCurrent ? `2px solid ${mode.color}` : "2px solid transparent" }}>
                {/* 曲番号 */}
                <span className="text-[10px] font-bold w-5 flex-shrink-0"
                  style={{ color: isCurrent ? mode.color : "#ffffff22" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* 曲情報 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate"
                    style={{ color: isCurrent ? "#ffffff" : isPast ? "#ffffff33" : "#ffffff55" }}>
                    {track.title}
                  </p>
                  <p className="text-[10px] truncate"
                    style={{ color: isCurrent ? `${mode.color}99` : "#ffffff22" }}>
                    {track.artist}
                  </p>
                </div>
                {/* BPM */}
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
      <div className="w-full">
        <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3">MODE</p>
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
