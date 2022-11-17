import { Card, Typography, CardContent, Grid } from '@mui/material'
import React, { ReactNode } from 'react'

export type Props = {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
  align?: 'center' | 'left'
  xs?: number
}

export const ResourceCard = ({
  align = 'center',
  xs = 4,
  icon,
  title,
  description,
  onClick,
}: Props) => {
  return (
    <Grid item xs={xs} onClick={onClick}>
      <Card
        sx={{
          textAlign: align,
          boxShadow: 'none',
          height: '100%',
          cursor: 'pointer',
        }}
      >
        <CardContent>
          {icon}
          <Typography variant="h3" mb={1} fontWeight={600}>
            {title}
          </Typography>
          <Typography color="secondary" lineHeight="28px">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
