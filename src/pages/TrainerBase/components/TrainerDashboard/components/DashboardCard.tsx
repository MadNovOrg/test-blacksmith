import React from 'react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/system'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

type DashboardCardProps = {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  onClick: VoidFunction
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundImage: `linear-gradient(
    to right,
    ${theme.palette.common.black},
    ${theme.colors.navy[500]},
    ${theme.colors.navy[500]}
  )`,
  position: 'relative',
  height: '100%',
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  minHeight: 220,
}))

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  children,
  onClick,
}) => {
  return (
    <StyledCard>
      <Box
        position="absolute"
        sx={{
          pointerEvents: 'none',
          fontSize: '15rem',
          right: 50,
          top: 10,
          opacity: 0.1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6">{title}</Typography>
      <Box display="flex" mt={2}>
        <Box sx={{ fontSize: '3rem' }}>{icon}</Box>
        <Box ml={2}>{children}</Box>
      </Box>
      <Box position="absolute" right={10} bottom={10}>
        <IconButton onClick={onClick}>
          <ArrowForwardIcon htmlColor="white" fontSize="large" />
        </IconButton>
      </Box>
    </StyledCard>
  )
}
