import React from 'react'
import {
  Box,
  LinearProgress,
  linearProgressClasses,
  useTheme,
} from '@mui/material'

export type ProgressBarProps = {
  percentage: number
  label?: string
}

const ProgressBar: React.FC<ProgressBarProps> = function ({
  percentage,
  label,
}) {
  const theme = useTheme()
  const rounded = Math.floor(percentage)
  return (
    <Box sx={{ position: 'relative' }}>
      <LinearProgress
        sx={{
          borderRadius: '3px',
          height: '24px',
          width: '100%',
          [`&.${linearProgressClasses.determinate}`]: {
            backgroundColor: 'grey.300',
          },
          [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: percentage > 100 ? 'red' : theme.colors.teal[500],
          },
        }}
        variant="determinate"
        value={percentage > 100 ? 100 : percentage}
      />
      <Box
        sx={{
          display: 'inline',
          position: 'absolute',
          bottom: '2px',
          left: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {label ? label : `${rounded}%`}
      </Box>
    </Box>
  )
}

export default ProgressBar
