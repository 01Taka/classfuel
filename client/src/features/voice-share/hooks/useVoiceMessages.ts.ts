// hooks/useVoiceMessages.ts
import { useEffect, useMemo, useState } from 'react'
import { VoiceMessageRepository } from '../../../firebase/firestore/repositories/voice-message/voice-message-repository'
import { storageManager } from '../../../firebase/storage/storageManager'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useUserService from '../../../hooks/useUsers'
import { Voice } from '../../../types/components/voice-types'
import { VoiceMessageWrite } from '../../../types/firebase/firestore-documents/voice-message/voice-message-document'
import { Visibility } from '../../../types/firebase/util-document-types'

const useVoiceMessages = () => {
  const { user } = useCurrentUser()
  const { fetchUsersByIds } = useUserService()

  const [voices, setVoices] = useState<Voice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)

  const voiceMessageRepo = useMemo(() => new VoiceMessageRepository(), [])

  const fetchVoices = async () => {
    setIsLoading(true)
    try {
      const data = await voiceMessageRepo.getAll()
      if (data) {
        const userRecord = await fetchUsersByIds(data.map((d) => d.createdById))
        const entries = await Promise.all(
          data.map(async (d) => {
            const url = await storageManager.getFileUrl(d.audioPath)
            return [d.audioPath, url] as const
          })
        )
        const audioUrlRecord: Record<string, string> =
          Object.fromEntries(entries)
        const formatted: Voice[] = data.map((d) => ({
          id: d.docId,
          audioUrl: audioUrlRecord[d.audioPath],
          creatorName: userRecord[d.createdById]?.displayName ?? '',
        }))
        setVoices(formatted)
      }
    } catch (error) {
      console.error('音声の取得に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const postVoice = async (data: {
    voiceBlob: Blob
    visibility: Visibility
  }) => {
    if (!user) {
      console.error('ユーザー情報が取得できませんでした')
      return
    }

    setIsPosting(true)
    try {
      const timestamp = Date.now().toString()
      const fileId = await storageManager.upload(
        ['voiceMessages', user.docId, timestamp],
        data.voiceBlob
      )
      const voiceMessage: VoiceMessageWrite = {
        audioPath: fileId,
        visibility: data.visibility,
        likes: 0,
      }
      await voiceMessageRepo.create(voiceMessage)
      await fetchVoices()
    } catch (error) {
      console.error('投稿に失敗しました:', error)
    } finally {
      setIsPosting(false)
    }
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  return {
    voices,
    isLoading,
    isPosting,
    postVoice,
  }
}

export default useVoiceMessages
