import React, { useEffect, useState } from 'react'
import { Container, Divider, Typography } from '@mui/material'
import { Voice } from '../../types/components/voice-type'
import VoiceList from '../molecules/VoiceList'
import useAsyncHandler from '../../hooks/async-processing/useAsyncHandler'
import { VoiceMessageRepository } from '../../firebase/firestore/repositories/voice-message/voice-message-repository'
import { VoiceMessageRead } from '../../types/firebase/firestore-documents/voice-message/voice-message-document'
import useUserService from '../../hooks/useUsers'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'
import VoicePostForm from '../organisms/VoicePostForm'
import { Visibility } from '../../types/firebase/util-document-types'
import { storageManager } from '../../firebase/storage/storageManager'
import useCurrentUser from '../../hooks/useCurrentUser'

const VoiceShare: React.FC = () => {
  const { user } = useCurrentUser()
  const { fetchUsersByIds } = useUserService()
  const { callAsyncFunction } = useAsyncHandler<VoiceMessageRead[]>()
  const [voices, setVoices] = useState<Voice[]>([])

  const fetchVoices = async () => {
    const repo = new VoiceMessageRepository()
    const result = await callAsyncFunction(repo.getAll.bind(repo), [])
    if (result.isSuccess && result.data) {
      const userRecord = await fetchUsersByIds(
        result.data.map((data) => data.createdById)
      )
      const voices: Voice[] = result.data.map((data) => ({
        id: data.docId,
        audioUrl: data.audioUrl,
        creatorName: userRecord[data.createdById]?.displayName ?? '',
      }))
      setVoices(voices)
    }
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  const postVoice = async (data: {
    voiceBlob: Blob
    visibility: Visibility
  }) => {
    console.log(data.voiceBlob)
    storageManager
      .uploadData('test', 'test1', data.voiceBlob)
      .then((res) => {
        console.log('success', res)
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <VoicePostForm onPost={postVoice} />
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom>
          応援ボイス一覧
        </Typography>
        <VoiceList voices={voices} />
      </Container>
      <BottomNavigationBar items={defaultNavItems} />
    </>
  )
}

export default VoiceShare
