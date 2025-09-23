import { Box } from '@mui/material'
import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

export const ResourceVideoItem = () => {
  const params = useParams()

  const accessProtocol = params['accessProtocol'] // this is http or https
  const resourceName = params['resourceName']

  /** this grabs the video resource name from the route params
   *  and pushes it to the window location to create a new Route
   *  this measure is taken in order to avoid displaying the actual
   *  video resource URL so that users can't share the direct link
   **/
  const changePageURL = useCallback(() => {
    const newURL = `/${resourceName}`
    window.history.replaceState({}, '', newURL)
  }, [resourceName])

  useEffect(() => {
    const navbar = document.querySelector('header') as HTMLDivElement
    const footer = document.querySelector('.app-footer') as HTMLDivElement
    if (navbar && footer) {
      navbar.style.display = 'none'
      footer.style.display = 'none'
    }

    changePageURL()

    return () => {
      if (navbar) {
        navbar.style.display = 'block'
        footer.style.display = 'block'
      }
    }
  }, [changePageURL])

  let videoURL = params['*']
  videoURL = videoURL?.substring(0, videoURL?.lastIndexOf('/'))

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <video
        controls
        controlsList="nodownload"
        style={{ width: '100%', height: '100%' }}
      >
        <source src={`${accessProtocol}//${videoURL}`} />
      </video>
    </Box>
  )
}
