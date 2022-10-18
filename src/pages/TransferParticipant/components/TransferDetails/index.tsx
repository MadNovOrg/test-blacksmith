import { ArrowForward } from '@mui/icons-material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { MarkOptional } from 'ts-essentials'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { TransferStepsEnum } from '../../types'
import { CourseInfoPanel } from '../CourseInfoPanel'
import FeesPanel, { FormValues } from '../FeesPanel'
import { useTransferParticipantContext } from '../TransferParticipantProvider'

export const TransferDetails: React.FC = () => {
  const { toCourse, backFrom, feesChosen, fromCourse, mode } =
    useTransferParticipantContext()
  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details'
  )

  const courseStartDate = useMemo(() => {
    if (fromCourse?.start) {
      return new Date(fromCourse.start)
    }

    return new Date()
  }, [fromCourse])

  const [formData, setFormData] = useState<
    MarkOptional<FormValues, 'feeType'> & { isValid: boolean }
  >({
    isValid: false,
    customFee: undefined,
    feeType: undefined,
  })

  const handleFeesChange = useCallback(
    (values: FormValues, isValid: boolean) => {
      setFormData({
        ...values,
        isValid,
      })
    },
    []
  )

  if (!toCourse) {
    return <Navigate to={'../'} replace />
  }

  return (
    <>
      <Typography variant="h4" mb={2}>
        {t('title')}
      </Typography>
      <Box mb={2}>
        <CourseInfoPanel
          course={{
            courseCode: toCourse.courseCode,
            startDate: toCourse.startDate,
            endDate: toCourse.endDate,
            venue: toCourse.venue ?? '',
          }}
        />
      </Box>

      <Typography variant="h4" mb={2}>
        {t('fees-panel-title')}
      </Typography>

      <FeesPanel
        courseStartDate={courseStartDate}
        onChange={handleFeesChange}
        mode={mode}
      />

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => backFrom(TransferStepsEnum.TRANSFER_DETAILS)}
        >
          {t('back-btn-label')}
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          disabled={!formData.isValid}
          onClick={() => feesChosen(formData.feeType, formData.customFee)}
        >
          {t('next-btn-label')}
        </Button>
      </Box>
    </>
  )
}
