import { useEffect, useState } from "react";

interface UseTimeDifferenceOptions {
  intervalMs?: number; // 更新間隔 (ミリ秒)
}

const DEFAULT_OPTIONS: UseTimeDifferenceOptions = {
  intervalMs: 1000, // デフォルト 1秒
};

const useTimeDifference = (
  targetDate: Date,
  options: UseTimeDifferenceOptions = {}
) => {
  const { intervalMs } = { ...DEFAULT_OPTIONS, ...options };

  // ⏱️ 経過時間（ミリ秒）の状態
  const [timeDiffMs, setTimeDiffMs] = useState(
    Date.now() - targetDate.getTime()
  );

  useEffect(() => {
    // ⏰ 一定間隔で現在時刻との差を更新
    const intervalId = setInterval(() => {
      const diffMs = Date.now() - targetDate.getTime();
      setTimeDiffMs(diffMs);
    }, intervalMs);

    // 🧹 アンマウント時にクリーンアップ
    return () => clearInterval(intervalId);
  }, [targetDate, intervalMs]);

  // 秒・分・時間・日単位の変換
  const timeDiffSeconds = Math.floor(timeDiffMs / 1000);
  const timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
  const timeDiffHours = Math.floor(timeDiffMinutes / 60);
  const timeDiffDays = Math.floor(timeDiffHours / 24);

  return {
    timeDiffMs,
    timeDiffSeconds,
    timeDiffMinutes,
    timeDiffHours,
    timeDiffDays,
  };
};

export default useTimeDifference;
