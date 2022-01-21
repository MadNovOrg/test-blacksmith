import React from 'react'

import { Typography } from '.'

export default {
  title: 'components/Typography',
  component: Typography,
}

export const Basic = () => {
  return (
    <div>
      <Typography variant="h4">h4</Typography>
      <Typography variant="h5">h5</Typography>
      <Typography variant="h6">h6</Typography>
      <Typography variant="subtitle1">subtitle1</Typography>
      <Typography variant="subtitle2">subtitle2</Typography>
      <Typography variant="subtitle3">subtitle3</Typography>
      <Typography variant="body1">body1</Typography>
      <Typography variant="body2">body2</Typography>
    </div>
  )
}
