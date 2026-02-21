export type TramStop = {
  id: string;
  name: string;
  nameEn: string;
};

// 富山ライトレール（富山駅北〜岩瀬浜）全停留所
export const TRAM_STOPS: TramStop[] = [
  { id: "toyama-ekikita", name: "富山駅北", nameEn: "Toyama-Ekikita" },
  { id: "intec-honsha-mae", name: "インテック本社前", nameEn: "Intec-Honsha-Mae" },
  { id: "ohirocho", name: "大広田", nameEn: "Oiroda" },
  { id: "shimo-okui", name: "下奥井", nameEn: "Shimo-Okui" },
  { id: "awajima", name: "粟島（大阪屋ショップ前）", nameEn: "Awajima" },
  { id: "ecchu-nakashima", name: "越中中島", nameEn: "Ecchu-Nakajima" },
  { id: "jogawa-hara", name: "城川原", nameEn: "Jogawara" },
  { id: "inujima-shinmachi", name: "犬島新町", nameEn: "Inujima-Shinmachi" },
  { id: "hasucho", name: "蓮町（ますのすしミュージアム前）", nameEn: "Hasucho" },
  { id: "oba-cho", name: "大場町", nameEn: "Obacho" },
  { id: "higashi-iwase", name: "東岩瀬", nameEn: "Higashi-Iwase" },
  { id: "keirin-jo-mae", name: "競輪場前", nameEn: "Keirinjo-Mae" },
  { id: "iwase-hama", name: "岩瀬浜", nameEn: "Iwase-Hama" },
];
