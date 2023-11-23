import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowForward } from '@mui/icons-material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { MarkOptional } from 'ts-essentials'

import { Course_Level_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import {
  TransferFormInput,
  TransferStepsEnum,
} from '@app/pages/TransferParticipant/types'
import { yup } from '@app/schemas'

import { CourseInfoPanel } from '../CourseInfoPanel'
import FeesPanel, { FormValues } from '../FeesPanel'
import { useTransferParticipantContext } from '../TransferParticipantProvider'

export const TransferDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t: _t } = useTranslation()
  const [displayReasonField, setDisplayReasonField] = useState<boolean>(false)

  const schema = useMemo(() => {
    return yup
      .object({
        transferReason: yup
          .string()
          .required(
            _t('common.validation-errors.required-field', {
              name: _t('common.transfer-reason'),
            })
          )
          .max(
            300,
            _t('common.validation-errors.maximum-chars-limit', { number: 300 })
          ),
      })
      .required()
  }, [_t])

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TransferFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      transferReason: '',
    },
  })

  const { toCourse, backFrom, feesChosen, fromCourse, mode, setReason } =
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

  useEffect(() => {
    if (displayReasonField !== Boolean(formData.feeType))
      setDisplayReasonField(Boolean(formData.feeType))
  }, [displayReasonField, formData.feeType])

  const handleFeesChange = useCallback(
    (values: FormValues, isValid: boolean) => {
      setFormData({
        ...values,
        isValid,
      })
    },
    []
  )

  if (!toCourse || !fromCourse) {
    return <Navigate to={'../'} replace />
  }

  const onSubmit = async (data: TransferFormInput) => {
    setReason(data.transferReason)
    feesChosen(
      formData.feeType,
      isNaN(Number(formData.customFee)) ? undefined : Number(formData.customFee)
    )
  }

  return (
    <>
      <Typography variant="h4" mb={2}>
        {t('title')}
      </Typography>
      <Box mb={2}>
        <CourseInfoPanel
          course={{
            id: toCourse.id,
            courseCode: toCourse.courseCode,
            level: toCourse.level,
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
        courseLevel={fromCourse.level as unknown as Course_Level_Enum}
        onChange={handleFeesChange}
        mode={mode}
      />

      {displayReasonField ? (
        <TextField
          fullWidth
          required
          variant="filled"
          error={!!errors.transferReason}
          helperText={<>{errors.transferReason?.message}</>}
          label={_t('pages.edit-course.transfer.reason-for-transfer')}
          inputProps={{
            sx: { height: 20 },
            'data-testid': 'reasonForTransfer-input',
          }}
          sx={{ bgcolor: 'grey.100', my: 2 }}
          {...register('transferReason')}
        />
      ) : null}

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
          onClick={handleSubmit(onSubmit)}
          data-testid="review-and-confirm"
          sx={{ margin: '10px' }}
        >
          {t('next-btn-label')}
        </Button>
      </Box>
    </>
  )
}
