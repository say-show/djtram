"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Reaction = {
  id: "good" | "vibe" | "fire";
  emoji: string;
  label: string;
  color: string;
};

const REACTIONS: Reaction[] = [
  { id: "good", emoji: "👍", label: "GOOD", color: "#00E5FF" },
  { id: "vibe", emoji: "🌊", label: "VIBE", color: "#9B59FF" },
  { id: "fire", emoji: "🔥", label: "FIRE", color: "#FF6B9B" },
];

type Particle = {
  id: number;
  emoji: string;
  x: number;
  delay: number;
};

export default function VibesScreen() {
  const [counts, setCounts] = useState({ good: 0, vibe: 0, fire: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [nextId, setNextId] = useState(0);

  const handleReaction = useCallback(
    (reaction: Reaction) => {
      // カウント更新
      setCounts((prev) => ({ ...prev, [reaction.id]: prev[reaction.id] + 1 }));

      // パーティクル追加
      const newParticles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
        id: nextId + i,
        emoji: reaction.emoji,
        x: Math.random() * 200 - 100,
        delay: i * 0.06,
      }));
      setNextId((n) => n + 6);
      setParticles((prev) => [...prev, ...newParticles]);

      // パーティクルを一定時間後に削除
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 2000);

      // トースト表示
      setToast("DJに届いた！");
      setTimeout(() => setToast(null), 1500);
    },
    [nextId]
  );

  const total = counts.good + counts.vibe + counts.fire;

  return (
    <div className="flex flex-col items-center min-h-full px-6 pt-16 pb-4 select-none relative overflow-hidden">
      {/* ヘッダー */}
      <p className="text-[10px] tracking-[0.4em] text-white/30 font-bold mb-2">GLIDE</p>
      <h2 className="text-lg font-black tracking-widest text-white/80 mb-2">SILENT VIBES</h2>
      <p className="text-xs text-white/30 mb-10">無音のまま、DJに熱量を届けよう</p>

      {/* パーティクル */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-3xl"
              style={{ bottom: 180, left: "50%", x: p.x }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -200, scale: 1.5 }}
              exit={{}}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* トースト */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-32 px-6 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm text-white font-bold"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* リアクションボタン */}
      <div className="flex gap-4 mb-10">
        {REACTIONS.map((r) => (
          <motion.button
            key={r.id}
            onClick={() => handleReaction(r)}
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center gap-2 w-24 py-6 rounded-2xl border transition-all duration-200"
            style={{
              borderColor: `${r.color}44`,
              background: `${r.color}0a`,
            }}
          >
            <span className="text-4xl">{r.emoji}</span>
            <span className="text-[10px] font-bold tracking-widest" style={{ color: r.color }}>
              {r.label}
            </span>
            <span className="text-lg font-black" style={{ color: r.color }}>
              {counts[r.id]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* 合計リアクション */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl p-5 border border-white/10 bg-white/05 text-center"
        >
          <p className="text-[10px] tracking-[0.3em] text-white/30 mb-1">TOTAL VIBES</p>
          <p className="text-4xl font-black text-white">{total}</p>
          <p className="text-xs text-white/30 mt-1">送信済みリアクション</p>
        </motion.div>
      )}

      {/* 説明テキスト */}
      <div className="mt-auto pt-8 text-center space-y-1">
        <p className="text-[11px] text-white/20 tracking-wide">周りには聞こえない。</p>
        <p className="text-[11px] text-white/20 tracking-wide">DJにだけ、あなたの熱量が届く。</p>
      </div>
    </div>
  );
}
