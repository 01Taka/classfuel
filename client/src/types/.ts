import { Timestamp } from 'firebase/firestore'

interface User {
  status: 'active' | 'studying' | 'on_break' | 'away' | 'offline' // ユーザーの現在状態
  session: StudySession | null
}

interface StudySession {
  type: 'study' | 'break' // セッションの種別
  startedAt: Timestamp
  expectedEndAt: Timestamp // ユーザーが設定した予定終了時刻
  stoppedAt: Timestamp | null // 途中で手動停止された場合に記録
  status: 'running' | 'stopped'
}

interface DailyReport {
  date: string // YYYY-MM-DD形式の日付
  studyTime: number // で記録
}
