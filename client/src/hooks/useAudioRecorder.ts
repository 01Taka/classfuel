import { useState } from 'react'

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  // 録音開始
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => chunks.push(event.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setAudioBlob(blob)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
  }

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  // 録音切り替え
  const switchRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // 音声クリア
  const clearAudio = () => setAudioBlob(null)

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    switchRecording,
    clearAudio,
  }
}

export default useAudioRecorder
