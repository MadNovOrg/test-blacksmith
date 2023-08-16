import { Box, Grid, GridProps } from '@mui/material'
import React from 'react'

export const PanesContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box borderTop={1} mt={4} borderColor="grey.200">
      <Grid container spacing={4}>
        {children}
      </Grid>
    </Box>
  )
}

export const LeftPane: React.FC<React.PropsWithChildren<GridProps>> = ({
  children,
  ...props
}) => {
  return (
    <Grid {...props} item md={6} xs={12}>
      <Box pt={4}>{children}</Box>
    </Grid>
  )
}

export const RightPane: React.FC<
  React.PropsWithChildren<
    GridProps & { slots?: { beforeContent?: React.ReactNode } }
  >
> = ({ slots, children, ...props }) => {
  return (
    <Grid {...props} item md={6} xs={12}>
      {slots?.beforeContent ? slots.beforeContent : null}

      <Box
        pl={{ md: 4, sx: 0 }}
        pt={4}
        boxShadow={{
          md: '-7px 0px 10px -11px rgba(184,184,184,1)',
          sx: 'none',
        }}
        minHeight={300}
      >
        {children}
      </Box>
    </Grid>
  )
}
