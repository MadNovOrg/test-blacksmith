import { Download } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import React from 'react'

type Props = { downloadLink: string } & ButtonProps<'a'>

export const DownloadButton: React.FC<Props> = ({
  downloadLink,
  children,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      target="_blank"
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<Download />}
      href={downloadLink}
    >
      {children}
    </Button>
  )
}
