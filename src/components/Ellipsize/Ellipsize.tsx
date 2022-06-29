import { Box, BoxProps } from '@mui/material'
import React from 'react'

type Props = {
  text?: string
  len?: number
  component?: BoxProps['component']
}

export const Ellipsize: React.FC<Props> = ({
  text = '',
  len = 150,
  component = 'span',
}) => {
  const needsCrop = text.length > len
  const cropped = needsCrop ? text.slice(0, len - 3) + '...' : text
  const title = needsCrop ? text : undefined
  return (
    <Box component={component} title={title}>
      {cropped}
    </Box>
  )
}
