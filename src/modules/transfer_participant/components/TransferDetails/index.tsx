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

import { FormValues as FeesFormValues } from '@app/components/FeesForm'
import { Course_Level_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { FormValues as ParticipantFormValues } from '@app/modules/course_details/course_attendees_tab/components/ParticipantPostalAddressForm'
import {
  TransferFormInput,
  TransferStepsEnum,
} from '@app/modules/transfer_participant/utils/types'
import { yup } from '@app/schemas'

import { isAddressInfoRequired } from '../../utils/utils'
import { CourseInfoPanel } from '../CourseInfoPanel'
import FeesPanel from '../FeesPanel'
import { useTransferParticipantContext } from '../TransferParticipantProvider'

type FormValues = MarkOptional<FeesFormValues, 'feeType'> &
  Partial<ParticipantFormValues>

export const TransferDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t: _t } = useTranslation()

  const [displayReasonField, setDisplayReasonField] = useState<boolean>(false)
  const {
    backFrom,
    fees,
    feesChosen,
    fromCourse,
    mode,
    reason,
    setParticipantPostalAddress,
    setReason,
    toCourse,
  } = useTransferParticipantContext()

  const schema = useMemo(() => {
    return yup
      .object({
        transferReason: yup
          .string()
          .required(
            _t('common.validation-errors.required-field', {
              name: _t('common.transfer-reason'),
            }),
          )
          .max(
            300,
            _t('common.validation-errors.maximum-chars-limit', { number: 300 }),
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
      transferReason: reason,
    },
  })

  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details',
  )

  const courseStartDate = useMemo(() => {
    if (fromCourse?.start) {
      return new Date(fromCourse.start)
    }

    return new Date()
  }, [fromCourse])

  const [formData, setFormData] = useState<
    MarkOptional<FeesFormValues, 'feeType'> & {
      isValid: boolean
    } & Partial<ParticipantFormValues>
  >({
    isValid: false,
    customFee: 0,
    feeType: undefined,
    inviteeAddressLine1: '',
    inviteeAddressLine2: '',
    inviteeCity: '',
    inviteeCountry: '',
    inviteePostCode: '',
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
    [],
  )

  if (!toCourse || !fromCourse) {
    return <Navigate to={'../'} replace />
  }

  const onSubmit = async (data: TransferFormInput) => {
    setReason(data.transferReason)
    feesChosen(
      formData.feeType,
      isNaN(Number(formData.customFee))
        ? undefined
        : Number(formData.customFee),
    )
    if (isAddressInfoRequired({ fromCourse, toCourse })) {
      setParticipantPostalAddress({
        inviteeAddressLine1: formData.inviteeAddressLine1 ?? '',
        inviteeAddressLine2: formData.inviteeAddressLine2 ?? '',
        inviteeCity: formData.inviteeCity ?? '',
        inviteeCountry: formData.inviteeCountry ?? '',
        inviteePostCode: formData.inviteePostCode ?? '',
        inviteeCountryCode: formData.inviteeCountryCode,
      })
    }
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
            reaccreditation: toCourse.reaccreditation,
            timezone: toCourse.timezone ?? 'Europe/London',
            residingCountry: toCourse.courseResidingCountry ?? 'GB-ENG',
          }}
        />
      </Box>

      <Typography variant="h4" mb={2}>
        {t('fees-panel-title')}
      </Typography>

      <FeesPanel
        courseStartDate={courseStartDate}
        courseLevel={fromCourse.level as unknown as Course_Level_Enum}
        priceCurrency={fromCourse.priceCurrency}
        onChange={handleFeesChange}
        mode={mode}
        courseToTransferTo={toCourse}
        defaultValues={fees}
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
