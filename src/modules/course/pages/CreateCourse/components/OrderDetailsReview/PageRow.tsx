import { Grid, Typography } from '@mui/material'
import { memo, type FC, type PropsWithChildren } from 'react'

import theme from '@app/theme'

const mainColor = theme.typography.body1.color
const secondaryColor = theme.typography.body2.color

type PageRowProps = {
  caption?: string | null
  isBold?: boolean
  label?: string | null
  mt?: number
  value?: string | null
  testId?: string
}

const PageRowComponent: FC<PropsWithChildren<PageRowProps>> = ({
  caption,
  isBold,
  label,
  mt = 0,
  value,
  testId,
}) => (
  <Grid container spacing={0} mt={mt} data-testid={testId}>
    <Grid item xs={8}>
      <Typography
        color={isBold ? mainColor : secondaryColor}
        fontWeight={isBold ? 600 : 400}
      >
        {label}
      </Typography>
    </Grid>

    <Grid item xs={4}>
      <Typography fontWeight={isBold ? 600 : 400} textAlign="right">
        {value}
      </Typography>
    </Grid>

    {caption ? (
      <Grid item xs={8}>
        <Typography variant="caption" color={secondaryColor}>
          {caption}
        </Typography>
      </Grid>
    ) : null}
  </Grid>
)

export const PageRow = memo(PageRowComponent)
