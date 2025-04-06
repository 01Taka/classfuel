// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import util from './util.json'

import authErrorJa from './auth/authErrorJa.json'
import dialogueJa from './auth/dialogueJa.json'
import subjectsJa from './subjects/subjectsJa.json'

import dialogueEn from './auth/dialogueEn.json'
import subjectsEn from './subjects/subjectsEn.json'

// 翻訳リソースをまとめる
const resources = {
  en: {
    translation: {
      ...dialogueEn,
      ...subjectsEn,
      ...util,
    },
  },
  ja: {
    translation: {
      ...dialogueJa,
      ...authErrorJa,
      ...subjectsJa,
      ...util,
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ja', // デフォルト言語
  fallbackLng: 'ja', // 言語が見つからない場合に使用する言語
  interpolation: {
    escapeValue: false, // ReactではXSS対策を自動で行うのでfalse
  },
})

export default i18n
