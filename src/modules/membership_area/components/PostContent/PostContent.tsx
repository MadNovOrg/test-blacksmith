import { GlobalStyles, Typography } from '@mui/material'
import React, { useLayoutEffect } from 'react'

import theme from '@app/theme'

export const PostContent: React.FC<
  React.PropsWithChildren<{ content: string }>
> = ({ content }) => {
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
    <>
      <GlobalStyles
        styles={{
          img: { maxWidth: '100%', height: 'auto' },
          figcaption: {
            textAlign: 'center',
            fontSize: theme.typography.body2.fontSize,
            color: theme.typography.body2.color,
          },
          blockquote: {
            fontStyle: 'italic',
            fontSize: theme.typography.subtitle2.fontSize,
            color: theme.typography.subtitle2.color,
            borderLeft: `5px solid ${theme.palette.primary.main}`,
            paddingLeft: theme.spacing(3),
            marginLeft: 0,
          },
          cite: {
            fontStyle: 'normal',
          },
          table: {
            width: '100%',
            tr: {
              '&:nth-of-type(2n)': {
                backgroundColor: theme.palette.grey[100],
              },
            },
            td: {
              padding: theme.spacing(1.3, 1),
              height: '36px',
            },
          },
          '.wp-block-embed': {
            padding: 0,
            width: '100%',
            margin: 0,

            '.video-shortcode': {
              position: 'relative',
              width: '100%',
              height: 0,
              paddingBottom: '56.25%',

              '& iframe': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              },
            },
          },
        }}
      />
      <Typography
        component="div"
        dangerouslySetInnerHTML={{
          __html: content.replace(/>\s+</g, '><'),
        }}
      />
    </>
  )
}
