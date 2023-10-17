import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const ResourceVideoItem = () => {
  useEffect(() => {
    const navbar = document.querySelector('header') as HTMLDivElement
    const footer = document.querySelector('.app-footer') as HTMLDivElement
    if (navbar && footer) {
      navbar.style.display = 'none'
      footer.style.display = 'none'
    }

    return () => {
      if (navbar) {
        navbar.style.display = 'block'
        footer.style.display = 'block'
      }
    }
  }, [])

  let videoURL = useParams()['*']
  videoURL = videoURL?.substring(0, videoURL?.lastIndexOf('/'))

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <video controls controlsList="nodownload">
        <source src={videoURL} />
      </video>
    </Box>
  )
}
