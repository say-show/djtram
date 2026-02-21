export type Track = {
  title: string;
  artist: string;
  bpm: number;
};

export type TramMode = {
  id: "boot-up" | "reset-chill" | "weekend";
  label: string;
  sublabel: string;
  genre: string;
  bpm: string;
  color: string;
  audioFile: string;
  setlist: Track[];
};

export const MODES: Record<TramMode["id"], TramMode> = {
  "boot-up": {
    id: "boot-up",
    label: "BOOT UP",
    sublabel: "朝の起動モード",
    genre: "Electro / Lo-Fi",
    bpm: "BPM 110–130",
    color: "#00E5FF",
    audioFile: "/audio/Morning Boost.mp3",
    setlist: [
      { title: "Digital Dawn",      artist: "Neon Collective",  bpm: 118 },
      { title: "City Pulse",        artist: "Drift Operator",   bpm: 122 },
      { title: "Morning Grid",      artist: "SubZero",          bpm: 115 },
      { title: "Caffeine Circuit",  artist: "Lo-Wave",          bpm: 128 },
      { title: "Startup Sequence",  artist: "Format X",         bpm: 120 },
    ],
  },
  "reset-chill": {
    id: "reset-chill",
    label: "RESET & CHILL",
    sublabel: "夜のリセットモード",
    genre: "Ambient / Jazz / Chill",
    bpm: "BPM 70–90",
    color: "#9B59FF",
    audioFile: "/audio/Night Reset.mp3",
    setlist: [
      { title: "After Hours",    artist: "Mellow District",  bpm: 78 },
      { title: "Slow Dissolve",  artist: "Haze & Tone",      bpm: 72 },
      { title: "Last Train",     artist: "Cinder Club",      bpm: 82 },
      { title: "Midnight Float", artist: "Deep Current",     bpm: 76 },
      { title: "Fade to Blue",   artist: "Ambient Shift",    bpm: 70 },
    ],
  },
  weekend: {
    id: "weekend",
    label: "WEEKEND",
    sublabel: "週末モード",
    genre: "J-Pop / City Pop",
    bpm: "BPM 90–120",
    color: "#FF6B9B",
    audioFile: "/audio/Tram Ride Holiday.mp3",
    setlist: [
      { title: "Tram Holiday",   artist: "Pastel Route",    bpm: 98  },
      { title: "Weekend Light",  artist: "City Glide",      bpm: 105 },
      { title: "Sunday Cruise",  artist: "Natsuki",         bpm: 96  },
      { title: "Toyama Pop",     artist: "Harbor Sound",    bpm: 110 },
      { title: "Blue Sky Loop",  artist: "Citrus Groove",   bpm: 102 },
    ],
  },
};

// 現在時刻と曜日からモードを自動判定
export function getCurrentMode(): TramMode {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=日, 6=土

  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return MODES["weekend"];
  if (hour >= 5 && hour < 12) return MODES["boot-up"];
  return MODES["reset-chill"];
}
