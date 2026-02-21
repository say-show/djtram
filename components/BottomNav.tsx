"use client";

type Screen = "play" | "route" | "vibes";

type Props = {
  current: Screen;
  onChange: (screen: Screen) => void;
};

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: "play", label: "PLAY", icon: "▶" },
  { id: "route", label: "ROUTE", icon: "⬡" },
  { id: "vibes", label: "VIBES", icon: "✦" },
];

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#0a0a0a]/90 backdrop-blur border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-4 transition-colors"
            >
              <span
                className="text-xl transition-all duration-300"
                style={{
                  color: isActive ? "#00E5FF" : "#ffffff44",
                  filter: isActive ? "drop-shadow(0 0 6px #00E5FF)" : "none",
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[10px] font-bold tracking-widest transition-colors duration-300"
                style={{ color: isActive ? "#00E5FF" : "#ffffff44" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
