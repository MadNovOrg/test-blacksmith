import React from 'react'
import { ThemeProvider } from '@mui/material'

import theme from '../../src/theme'

export default function withMuiThemeProvider(Story: any) {
  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  )
}
