"use client";

import { motion } from "framer-motion";

type Props = {
  isPlaying: boolean;
  color: string;
};

const BAR_COUNT = 20;

export default function WaveAnimation({ isPlaying, color }: Props) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ height: 40, backgroundColor: color, opacity: 0.7 }}
          animate={
            isPlaying
              ? {
                  scaleY: [0.2, 1, 0.4, 0.8, 0.2],
                  transition: {
                    duration: 0.8 + (i % 5) * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.04,
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
