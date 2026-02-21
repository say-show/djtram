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
    <main className="flex-1 pb-20">
      {screen === "play" && <PlayScreen />}
      {screen === "route" && <RouteScreen />}
      {screen === "vibes" && <VibesScreen />}
      <BottomNav current={screen} onChange={setScreen} />
    </main>
  );
}
