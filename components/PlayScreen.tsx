"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentMode, TramMode, MODES } from "@/lib/modeUtils";
import WaveAnimation from "./WaveAnimation";

const MODE_LIST = Object.values(MODES);

export default function PlayScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<TramMode>(MODES["boot-up"]);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // モード変更時に再生中なら切り替え
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = mode.audioFile;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [mode]);

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

  return (
    <div className="flex flex-col items-center min-h-full px-6 pt-16 pb-4 select-none">
      {/* 音源未準備バナー */}
      <AnimatePresence>
        {!hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white/40"
          >
            音源未準備 — UIデモモード
          </motion.div>
        )}
      </AnimatePresence>

      {/* ロゴ */}
      <p className="text-xs tracking-[0.4em] text-white/30 font-bold mb-2">GLIDE</p>

      {/* モード表示 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-center mb-10"
        >
          <h1
            className="text-3xl font-black tracking-widest"
            style={{ color: mode.color, textShadow: `0 0 20px ${mode.color}88` }}
          >
            {mode.label}
          </h1>
          <p className="text-white/40 text-xs mt-1 tracking-wider">{mode.sublabel}</p>
        </motion.div>
      </AnimatePresence>

      {/* メインPlayボタン */}
      <div className="relative flex items-center justify-center mb-10">
        {/* 外周リングアニメーション */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute rounded-full border"
              style={{ borderColor: `${mode.color}44`, width: 200, height: 200 }}
              animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full border"
              style={{ borderColor: `${mode.color}33`, width: 200, height: 200 }}
              animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </>
        )}

        {/* ボタン本体 */}
        <motion.button
          onClick={togglePlay}
          whileTap={{ scale: 0.93 }}
          className="relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${mode.color}33, ${mode.color}11)`,
            border: `2px solid ${mode.color}88`,
            boxShadow: isPlaying
              ? `0 0 30px ${mode.color}66, 0 0 80px ${mode.color}33`
              : `0 0 10px ${mode.color}22`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isPlaying ? "pause" : "play"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-5xl select-none"
              style={{ color: mode.color }}
            >
              {isPlaying ? "⏸" : "▶"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 波形アニメーション */}
      <div className="mb-8">
        <WaveAnimation isPlaying={isPlaying} color={mode.color} />
      </div>

      {/* セットリスト情報 */}
      <div
        className="w-full rounded-2xl p-5 border mb-8"
        style={{ borderColor: `${mode.color}22`, background: `${mode.color}08` }}
      >
        <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3">LIVE SET</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/50">ジャンル</span>
            <span className="text-xs text-white/80">{mode.genre}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/50">BPM</span>
            <span className="text-xs text-white/80">{mode.bpm}</span>
          </div>
        </div>
      </div>

      {/* モード手動切り替え */}
      <div className="w-full">
        <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3">MODE</p>
        <div className="flex gap-2">
          {MODE_LIST.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m)}
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

      {/* 非表示audio要素 */}
      <audio
        ref={audioRef}
        src={mode.audioFile}
        loop
        onCanPlay={() => setHasAudio(true)}
        onError={() => setHasAudio(false)}
      />
    </div>
  );
}
