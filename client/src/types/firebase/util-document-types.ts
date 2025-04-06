export type Gender = 'male' | 'female' | 'other'

export type Visibility =
  | 'public' // 全体
  | 'mutual' // 相互フォロー
  | 'acquaintance' // 知り合い（LINE的）
  | 'private' // 特定ユーザー宛（後で使う予定）
