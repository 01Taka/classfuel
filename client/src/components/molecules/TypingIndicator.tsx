import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, SxProps } from '@mui/material';

interface TypingIndicatorProps {
  username: string;
  sx?: SxProps;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username, sx }) => {
  return (
    <Card
      sx={{
        maxWidth: "60%",
        p: 1,
        m: 1,
        backgroundColor: "#FFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx
      }}
    >
      <CardContent sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
          <Typography sx={{ marginRight: 1 }}>{username}</Typography>
          <Typography sx={{ marginRight: 1 }}>が入力中</Typography>
          <CircularProgress size={24} sx={{ color: "gray" }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default TypingIndicator;
