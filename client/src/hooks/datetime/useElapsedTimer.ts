import { useCallback, useEffect, useRef, useState } from "react";

interface UseElapsedTimerOptions {
  intervalMs: number;
  initialValue: number;
}

interface UseElapsedTimerReturn {
  start: () => void;
  stop: () => void;
  reset: (value?: number) => void;
  resetAndStart: (value?: number) => void;
  isRunning: boolean;
  count: number;
  timeMs: number;
}

const DEFAULT_OPTIONS: UseElapsedTimerOptions = {
  intervalMs: 1000,
  initialValue: 0,
};

function useElapsedTimer(options: Partial<UseElapsedTimerOptions> = {}): UseElapsedTimerReturn {
  const { intervalMs, initialValue } = { ...DEFAULT_OPTIONS, ...options };

  const [count, setCount] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  // 🎯 タイマー開始
  const start = useCallback(() => {
    if (isRunning || timerIdRef.current !== null) return; // 既に実行中ならスキップ

    if (pausedTimeRef.current !== null && startTimeRef.current !== null) {
      // ⏸️ 再開時にポーズ時間を調整
      startTimeRef.current += Date.now() - pausedTimeRef.current;
      pausedTimeRef.current = null;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - count * intervalMs;
    }

    timerIdRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / intervalMs);
        setCount(elapsed);
      }
    }, intervalMs);

    setIsRunning(true);
  }, [intervalMs, count, isRunning]);

  // ⏹️ タイマー停止
  const stop = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
      pausedTimeRef.current = Date.now(); // 一時停止時間を記録
      setIsRunning(false);
    }
  }, []);

  // 🔄 タイマーリセット
  const reset = useCallback((value: number = 0) => {
    stop(); // 既存のタイマーを停止
    setCount(value);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
  }, [stop]);

  // 🔁 タイマーリセット＆再スタート
  const resetAndStart = useCallback((value: number = 0) => {
    reset(value);
    start(); // 明示的にスタート
  }, [reset, start]);

  // 🧹 クリーンアップ
  useEffect(() => {
    return () => {
      stop(); // コンポーネントのアンマウント時に停止
    };
  }, [stop]);

  const timeMs = count * intervalMs;

  return { start, stop, reset, resetAndStart, isRunning, count, timeMs };
}

export default useElapsedTimer;
