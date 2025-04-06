import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firestoreの初期化とキャッシュ設定
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(), // IndexedDBキャッシュの有効化
})

const auth = getAuth(app)
const storage = getStorage(app)
let messaging

// Messagingのサポート確認と初期化
if (await isSupported()) {
  messaging = getMessaging(app)
} else {
  console.log('Firebase Messaging is not supported in this environment')
}

const googleProvider = new GoogleAuthProvider()

export { db, auth, googleProvider, storage, messaging }
