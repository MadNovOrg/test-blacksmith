import { Typography } from '@mui/material'
import React, { useLayoutEffect } from 'react'

export const PostContent: React.FC<{ content: string }> = ({ content }) => {
  useLayoutEffect(() => {
    const lazyImages =
      document.querySelectorAll<HTMLImageElement>('img.lazyload')

    lazyImages.forEach(image => {
      // lazy load images have an empty placeholder image within src set,
      // while src has a correct image url
      image.srcset = ''
    })
  }, [])

  return (
    <Typography
      component="div"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )
}
