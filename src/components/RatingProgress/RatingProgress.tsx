import { styled, LinearProgress, LinearProgressProps } from '@mui/material'
import { get } from 'lodash-es'

export const RatingProgress = styled(
  ({
    color: _color,
    ...props
  }: Omit<LinearProgressProps, 'color'> & { color: string }) => (
    <LinearProgress {...props} />
  ),
)(({ color, theme }) => ({
  height: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],

  '& .MuiLinearProgress-bar': {
    backgroundColor:
      get(theme.palette, color) || (get(theme.colors, color) as string),
  },
}))
