import { Box, styled } from '@mui/material'

export const ContentDetailsBox = styled(Box)(({ theme }) => ({
  width: '50%',

  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}))
