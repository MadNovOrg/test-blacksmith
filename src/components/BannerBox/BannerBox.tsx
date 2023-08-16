import { Box, styled } from '@mui/material'

import gradient from './assets/gradient-bg.png'

export const BannerBox = styled(Box)<{ roundedCorners?: boolean }>(
  ({ theme, roundedCorners = false }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(5),
    background: `url('${gradient}')`,
    backgroundSize: 'cover',
    borderRadius: roundedCorners ? 30 : 0,

    [theme.breakpoints.down('lg')]: {
      display: 'block',
      padding: theme.spacing(5),
      textAlign: 'center',
    },
  })
)
