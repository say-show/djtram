"use client";

type Screen = "play" | "route" | "vibes";

type Props = {
  current: Screen;
  onChange: (screen: Screen) => void;
};

// Unicode記号はiOSで絵文字化するため、SVGアイコンを使用
function IconPlay({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 3.5L17 10L5 16.5V3.5Z" fill={color} />
    </svg>
  );
}

function IconRoute({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L16.5 5.75V13.25L10 17L3.5 13.25V5.75L10 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconVibes({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L11.8 8.2L18 10L11.8 11.8L10 18L8.2 11.8L2 10L8.2 8.2L10 2Z"
        fill={color}
      />
    </svg>
  );
}

const TABS: { id: Screen; label: string; Icon: React.FC<{ color: string }> }[] = [
  { id: "play",  label: "PLAY",  Icon: IconPlay  },
  { id: "route", label: "ROUTE", Icon: IconRoute },
  { id: "vibes", label: "VIBES", Icon: IconVibes },
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
          const color = isActive ? "#00E5FF" : "#ffffff44";
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-4 transition-colors"
            >
              <span
                className="transition-all duration-300"
                style={{ filter: isActive ? "drop-shadow(0 0 6px #00E5FF)" : "none" }}
              >
                <tab.Icon color={color} />
              </span>
              <span
                className="text-[10px] font-bold tracking-widest transition-colors duration-300"
                style={{ color }}
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
