import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'

export const Course: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackOutlinedIcon />}
        >
          Back
        </Button>
      </Box>

      <Box flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}
