import { styled, Typography, TypographyProps } from '@mui/material'

import theme from '@app/theme'

const StyledTypography = styled(Typography)(() => ({}))

export const PageTitle: React.FC<TypographyProps> = props => (
  <StyledTypography
    variant="h1"
    color="primary"
    textAlign="center"
    paddingTop={theme.spacing(6)}
    paddingBottom={theme.spacing(10)}
    {...props}
  />
)
