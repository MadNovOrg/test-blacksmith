import { Box, styled, Typography } from '@mui/material'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check'

const Circle = styled('span', {
  shouldForwardProp: prop => prop !== 'completed' && prop !== 'line',
})<{
  completed?: boolean
  line?: boolean
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
    content: props.line ? "''" : null,
    position: 'absolute',
    width: 1,
    height: 30,
    backgroundColor: props.theme.palette.success.main,
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
      <Circle completed={completed} line={index === 1}>
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
