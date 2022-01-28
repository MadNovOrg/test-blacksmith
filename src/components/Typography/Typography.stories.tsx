import React from 'react'

import { Icon } from '../Icon'

import { Typography } from '.'

export default {
  title: 'components/Typography',
  component: Typography,
}

export const Basic = () => {
  return (
    <div>
      <Typography variant="h3">h3</Typography>
      <Typography variant="h4">h4</Typography>
      <Typography variant="h5">h5</Typography>
      <Typography variant="h6">h6</Typography>
      <Typography variant="subtitle1">subtitle1</Typography>
      <Typography variant="subtitle2">subtitle2</Typography>
      <Typography variant="subtitle3">subtitle3</Typography>
      <Typography variant="body1">body1</Typography>
      <Typography variant="body2">body2</Typography>
      <Typography variant="body3">body3</Typography>

      <Typography variant="body1" startIcon={<Icon name="arrow-left" />}>
        With startIcon
      </Typography>
      <Typography variant="body1" startIcon={<Icon name="person" />}>
        With startIcon
      </Typography>
      <Typography variant="body1" endIcon={<Icon name="arrow-right" />}>
        With endIcon
      </Typography>
    </div>
  )
}
