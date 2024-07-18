import { styled, Typography } from '@mui/material'

import theme from '@app/theme'

export const PageTitle = styled(Typography)(() => ({}))

PageTitle.defaultProps = {
  variant: 'h1',
  color: 'primary',
  textAlign: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(10),
}
