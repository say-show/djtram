"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PlayScreen from "@/components/PlayScreen";
import RouteScreen from "@/components/RouteScreen";
import VibesScreen from "@/components/VibesScreen";

type Screen = "play" | "route" | "vibes";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("play");

  return (
    <main className="flex-1" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
      {/* アンマウントせず非表示にすることでaudio再生を維持 */}
      <div style={{ display: screen === "play" ? "block" : "none" }}><PlayScreen /></div>
      <div style={{ display: screen === "route" ? "block" : "none" }}><RouteScreen /></div>
      <div style={{ display: screen === "vibes" ? "block" : "none" }}><VibesScreen /></div>
      <BottomNav current={screen} onChange={setScreen} />
    </main>
  );
}
