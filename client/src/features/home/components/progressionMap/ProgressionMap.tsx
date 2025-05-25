import React from 'react'
import { Box } from '@mui/material'
import MapBackGround from './MapBackGround'
import MapCells from './MapCells'
import MapCharacter from './MapCharacter'
import MapStateText from './MapStateText'

interface ProgressionMapProps {
  startCellId?: number
  endCellId?: number
  todayStudyTimeMs: number
  todayAdvanceNumber: number
  totalAdvanceNumber: number
}

const ProgressionMap: React.FC<ProgressionMapProps> = ({
  startCellId = 1,
  endCellId = startCellId + 4,
  todayStudyTimeMs = 0,
  todayAdvanceNumber = 0,
}) => {
  const cells = Array.from(
    { length: endCellId - startCellId },
    (_, i) => i + startCellId
  )

  return (
    <Box position="relative" width="100%" height={350}>
      {/* 背景レイヤー */}
      <Box position="absolute" top={0} left={0} width="100%" height="100%">
        <MapBackGround />
      </Box>

      {/* 状態テキストレイヤー */}
      <Box
        position="absolute"
        top={30}
        left="10%"
        width="80%"
        display="flex"
        justifyContent="center"
      >
        <MapStateText
          todayStudyTimeMs={todayStudyTimeMs}
          advanceNumber={todayAdvanceNumber}
        />
      </Box>

      {/* セルとキャラクター表示 */}
      <Box
        position="absolute"
        bottom={30}
        left="50%"
        sx={{ transform: 'translateX(-50%)' }}
      >
        <Box position="relative">
          <MapCells cells={cells} cellSize={78} />
          <Box position="absolute" top={-65} left="23%">
            <MapCharacter />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProgressionMap
