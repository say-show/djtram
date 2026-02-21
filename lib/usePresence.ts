"use client";

import { useEffect, useState } from "react";
import { ref, push, set, remove, onValue, onDisconnect, serverTimestamp } from "firebase/database";
import { database } from "./firebase";

/**
 * Firebase Realtime Database でリアルタイムの接続人数を管理するフック。
 * - マウント時に自分のプレゼンスを登録し、切断時に自動削除
 * - 表示カウントは2ずつ変化してスムーズに見せる
 */
export function usePresence(): number {
  const [rawCount, setRawCount] = useState(1);
  const [displayCount, setDisplayCount] = useState(1);

  useEffect(() => {
    const configured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
    if (!configured) return;

    // 自分のプレゼンスを登録
    const myRef = push(ref(database, "presence"));
    set(myRef, { connectedAt: serverTimestamp() });
    onDisconnect(myRef).remove();

    // 接続人数をリアルタイムで取得
    const presenceRef = ref(database, "presence");
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      setRawCount(snapshot.size ?? 1);
    });

    return () => {
      unsubscribe();
      remove(myRef);
    };
  }, []);

  // rawCount に向かって最大2ずつ変化（スムージング）
  useEffect(() => {
    if (displayCount === rawCount) return;
    const timer = setTimeout(() => {
      setDisplayCount((prev) => {
        const diff = rawCount - prev;
        const step = Math.sign(diff) * Math.min(2, Math.abs(diff));
        return prev + step;
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [rawCount, displayCount]);

  return displayCount;
}
