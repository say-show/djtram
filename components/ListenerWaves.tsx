"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  isPlaying: boolean;
  color: string;
};

const BAR_COUNT = 20;
const MIN_LISTENERS = 5;
const MAX_LISTENERS = 12;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type LayerParams = {
  opacity: number;
  duration: number;
  delay: number;
};

function generateLayers(count: number): LayerParams[] {
  return Array.from({ length: count }, () => ({
    opacity: randomBetween(0.06, 0.12),
    duration: randomBetween(0.6, 1.8),
    delay: randomBetween(0, 0.8),
  }));
}

// 単一リスナーレイヤー
function ListenerLayer({
  layer,
  isPlaying,
  color,
}: {
  layer: LayerParams;
  isPlaying: boolean;
  color: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ height: 40, backgroundColor: color, opacity: layer.opacity }}
          animate={
            isPlaying
              ? {
                  scaleY: [0.15, 0.9, 0.3, 0.7, 0.15],
                  transition: {
                    duration: layer.duration + (i % 5) * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: layer.delay + i * 0.03,
                  },
                }
              : { scaleY: 0.15 }
          }
          initial={{ scaleY: 0.15 }}
        />
      ))}
    </div>
  );
}

// SSRと一致させるための固定初期値
const INITIAL_LAYERS: LayerParams[] = Array.from({ length: 8 }, (_, i) => ({
  opacity: 0.08,
  duration: 1.0 + (i % 5) * 0.2,
  delay: i * 0.1,
}));

export default function ListenerWaves({ isPlaying, color }: Props) {
  // 初期値は固定（SSR/クライアント一致させるため）、マウント後にランダム化
  const [layers, setLayers] = useState<LayerParams[]>(INITIAL_LAYERS);

  // マウント後にランダム値で初期化
  useEffect(() => {
    setLayers(generateLayers(Math.floor(randomBetween(MIN_LISTENERS, MAX_LISTENERS + 1))));
  }, []);

  // 30秒ごとにリスナー数を ±1〜2 変動
  useEffect(() => {
    const interval = setInterval(() => {
      setLayers((prev) => {
        const delta = Math.floor(randomBetween(1, 3)) * (Math.random() < 0.5 ? 1 : -1);
        const nextCount = Math.min(MAX_LISTENERS, Math.max(MIN_LISTENERS, prev.length + delta));
        if (nextCount === prev.length) return prev;
        return generateLayers(nextCount);
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-12 w-full flex items-center justify-center">
      {layers.map((layer, i) => (
        <ListenerLayer key={i} layer={layer} isPlaying={isPlaying} color={color} />
      ))}
    </div>
  );
}
