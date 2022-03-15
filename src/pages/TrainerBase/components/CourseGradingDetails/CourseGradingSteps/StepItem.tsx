import { Box, styled, Typography } from '@mui/material'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check'

const Circle = styled('span', {
  shouldForwardProp: prop => prop !== 'completed',
})<{
  completed?: boolean
}>(props => ({
  borderRadius: '50%',
  border: '1px solid',
  borderColor: props.theme.palette.success.main,
  color: props.completed
    ? props.theme.palette.common.white
    : props.theme.palette.text.primary,
  width: 40,
  height: 40,
  marginRight: 30,
  position: 'relative',
  backgroundColor: props.completed
    ? props.theme.palette.success.main
    : props.theme.palette.common.white,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'inline-flex',

  '&:after': {
    content: "''",
    position: 'absolute',
    width: 1,
    height: 30,
    backgroundColor: 'inherit',
    top: 'calc(100% + 6px)',
  },
}))

interface StepItemProps {
  completed: boolean
  index: number
}

export const StepItem: React.FC<StepItemProps> = ({
  completed,
  index,
  children,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={5}
      data-testid={`step-item-${index}`}
    >
      <Circle completed={completed}>
        {completed ? (
          <CheckIcon />
        ) : (
          <Typography fontWeight={600}>{index}</Typography>
        )}
      </Circle>
      {children}
    </Box>
  )
}
