import { Typography } from '@mui/material'
import React, { useEffect } from 'react'

import { StepsEnum } from '../../types'
import { useCreateCourse } from '../CreateCourseProvider'

export const LicenseOrderDetails = () => {
  const { setCurrentStepKey } = useCreateCourse()

  useEffect(() => {
    setCurrentStepKey(StepsEnum.LICENSE_ORDER_DETAILS)
  }, [setCurrentStepKey])

  return <Typography>Order details here</Typography>
}
