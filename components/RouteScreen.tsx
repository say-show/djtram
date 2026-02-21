"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRAM_STOPS } from "@/lib/tramStops";

export default function RouteScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const currentStop = TRAM_STOPS[currentIndex];
  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 7秒ごとに次の駅へ自動移動（最後まで行ったら最初に戻る）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % TRAM_STOPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [timerKey]);

  // 駅が変わったら自動スクロールで追随
  useEffect(() => {
    stopRefs.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentIndex]);

  // 手動操作時はタイマーをリセット
  const goTo = (i: number) => {
    setCurrentIndex(i);
    setTimerKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col px-6 pt-16 select-none" style={{ height: "calc(100vh - 80px)" }}>
      {/* ヘッダー */}
      <p className="text-[10px] tracking-[0.4em] text-white/30 font-bold mb-2">GLIDE</p>
      <h2 className="text-lg font-black tracking-widest text-white/80 mb-4">ROUTE SYNC</h2>

      {/* 現在停留所カード */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStop.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="w-full rounded-2xl p-4 border border-[#00E5FF]/30 bg-[#00E5FF]/05 mb-4 flex-shrink-0"
        >
          <p className="text-[10px] tracking-[0.3em] text-[#00E5FF]/60 mb-1">現在地</p>
          <p className="text-2xl font-black text-white" style={{ textShadow: "0 0 10px #00E5FF44" }}>
            {currentStop.name}
          </p>
          <p className="text-xs text-white/30 mt-1">{currentStop.nameEn}</p>
        </motion.div>
      </AnimatePresence>

      {/* 路線図（スクロールエリア） */}
      <div className="flex gap-4 flex-1 overflow-y-auto pb-2 min-h-0">
        {/* 縦ライン */}
        <div className="flex flex-col items-center pt-1 flex-shrink-0">
          {TRAM_STOPS.map((stop, i) => (
            <div key={stop.id} className="flex flex-col items-center">
              <motion.div
                className="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all duration-300"
                style={{
                  borderColor: i === currentIndex ? "#00E5FF" : "#ffffff33",
                  backgroundColor: i === currentIndex ? "#00E5FF" : "transparent",
                  boxShadow: i === currentIndex ? "0 0 8px #00E5FF" : "none",
                }}
                animate={i === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {i < TRAM_STOPS.length - 1 && (
                <div
                  className="w-[2px] flex-shrink-0 transition-colors duration-300"
                  style={{
                    height: 36,
                    backgroundColor: i < currentIndex ? "#00E5FF66" : "#ffffff15",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 停留所名リスト */}
        <div className="flex flex-col">
          {TRAM_STOPS.map((stop, i) => (
            <div
              key={stop.id}
              ref={(el) => { stopRefs.current[i] = el; }}
              className="flex items-center"
              style={{ minHeight: i < TRAM_STOPS.length - 1 ? 48 : 12 }}
            >
              <button
                onClick={() => goTo(i)}
                className="text-left transition-all duration-300"
              >
                <span
                  className="text-sm font-bold"
                  style={{
                    color: i === currentIndex ? "#00E5FF" : i < currentIndex ? "#ffffff66" : "#ffffff33",
                    textShadow: i === currentIndex ? "0 0 8px #00E5FF" : "none",
                  }}
                >
                  {stop.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 前後ボタン（常に表示） */}
      <div className="flex gap-3 pt-3 pb-2 flex-shrink-0">
        <button
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-3 rounded-xl border text-sm font-bold tracking-wider transition-all duration-200"
          style={{
            borderColor: currentIndex === 0 ? "#ffffff11" : "#00E5FF44",
            color: currentIndex === 0 ? "#ffffff22" : "#00E5FF",
          }}
        >
          ← 前の停留所
        </button>
        <button
          onClick={() => goTo(Math.min(TRAM_STOPS.length - 1, currentIndex + 1))}
          disabled={currentIndex === TRAM_STOPS.length - 1}
          className="flex-1 py-3 rounded-xl border text-sm font-bold tracking-wider transition-all duration-200"
          style={{
            borderColor: currentIndex === TRAM_STOPS.length - 1 ? "#ffffff11" : "#00E5FF44",
            color: currentIndex === TRAM_STOPS.length - 1 ? "#ffffff22" : "#00E5FF",
          }}
        >
          次の停留所 →
        </button>
      </div>
    </div>
  );
}
