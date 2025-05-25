import { Avatar } from '@mui/material'
import React from 'react'
import Character from '../../../../assets/images/sample-character.png'
import { motion } from 'framer-motion'

interface MapCharacterProps {
  size?: number
}

const MapCharacter: React.FC<MapCharacterProps> = ({ size = 100 }) => {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }} // 上へ10px浮いて戻る
      transition={{
        duration: 3, // 1周期2秒
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Avatar
        variant="square"
        src={Character}
        sx={{ width: size, height: size }}
      />
    </motion.div>
  )
}

export default MapCharacter
