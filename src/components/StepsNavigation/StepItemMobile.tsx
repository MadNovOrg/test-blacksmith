import { Box, styled, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Circle = styled('span')(props => ({
  borderRadius: '50%',
  border: '1px solid',
  borderColor: props.theme.palette.success.main,
  color: props.theme.palette.text.primary,
  width: 60,
  height: 60,
  marginRight: 30,
  position: 'relative',
  backgroundColor: props.theme.palette.common.white,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'inline-flex',

  '&:after': {
    content: null,
    position: 'absolute',
    width: 1,
    height: 44,
    backgroundColor: props.theme.palette.success.main,
    top: '100%',
  },
}))

interface StepItemProps {
  stepNumber: number
  stepTotal: number
}

export const StepItemMobile: React.FC<
  React.PropsWithChildren<StepItemProps>
> = ({ stepNumber, stepTotal, children }) => {
  const { t } = useTranslation()

  return (
    <Box
      display="flex"
      alignItems="center"
      mb={5}
      data-testid={`step-item-${stepNumber}`}
    >
      <Circle>
        <Typography fontWeight={600}>
          {t('pages.create-course.step-of', {
            completed: stepNumber,
            total: stepTotal,
          })}
        </Typography>
      </Circle>
      {children}
    </Box>
  )
}
