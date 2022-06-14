import { styled, Box } from '@mui/material'

export const YTContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%',

  '& .video': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})
