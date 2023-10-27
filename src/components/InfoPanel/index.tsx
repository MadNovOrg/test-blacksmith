import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import { InfoRow } from './InfoRow'

export { InfoRow }

export const InfoPanel: React.FC<
  React.PropsWithChildren<{
    title?: string
    titlePosition?: 'inside' | 'outside'
    renderContent?: (
      content: React.ReactNode,
      props: BoxProps
    ) => React.ReactNode
  }>
> = ({ title, children, titlePosition = 'inside', renderContent, ...rest }) => {
  const content = (
    <>
      {title && titlePosition === 'inside' ? (
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
      ) : null}
      {children}
    </>
  )

  const contentBoxProps: BoxProps = {
    p: 2,
    bgcolor: 'white',
  }

  return (
    <Box {...rest}>
      {titlePosition === 'outside' && title ? (
        <Typography variant="h4" mb={2}>
          {title}
        </Typography>
      ) : null}
      {typeof renderContent === 'function'
        ? renderContent(content, contentBoxProps)
        : null}

      {!renderContent ? <Box {...contentBoxProps}>{content}</Box> : null}
    </Box>
  )
}
