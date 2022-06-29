import { Box, BoxProps, Tooltip } from '@mui/material'
import React from 'react'

type Props = {
  text?: string
  len?: number
  component?: BoxProps['component']
}

export const Ellipsize: React.FC<Props> = ({
  text = '',
  len = 50,
  component = 'span',
}) => {
  const needsCrop = text.length > len
  const cropped = needsCrop ? text.slice(0, len - 3).trim() + '...' : text

  const textElement = <Box component={component}>{cropped}</Box>

  return needsCrop ? (
    <Tooltip title={text} placement="top" arrow={true}>
      {textElement}
    </Tooltip>
  ) : (
    textElement
  )
}
