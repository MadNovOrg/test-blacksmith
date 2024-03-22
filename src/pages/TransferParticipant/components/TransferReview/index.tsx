import { ArrowBack } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Big from 'big.js'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course,
  Course_Level_Enum,
  TransferFeeType,
  TransferParticipantMutation,
  TransferParticipantMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { TRANSFER_PARTICIPANT } from '../../queries'
import { TransferStepsEnum } from '../../types'
import {
  getTransferTermsFee,
  isAddressInfoRequired,
  isTrainTheTrainerCourse,
} from '../../utils'
import { CourseInfoPanel } from '../CourseInfoPanel'
import {
  TransferModeEnum,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

export const TransferReview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t, _t } = useScopedTranslation('pages.transfer-participant')
  const navigate = useNavigate()
  const [success, setSuccess] = useState<boolean | undefined>()
  const [error, setError] = useState('')

  const {
    toCourse,
    fromCourse,
    fees,
    backFrom,
    participant,
    mode,
    completeStep,
    cancel,
    reason,
    virtualCourseParticipantAdress,
  } = useTransferParticipantContext()

  const { addSnackbarMessage } = useSnackbar()

  const [{ error: networkError, fetching }, transferParticipant] = useMutation<
    TransferParticipantMutation,
    TransferParticipantMutationVariables
  >(TRANSFER_PARTICIPANT)

  const handleParticipantTransfer = async () => {
    if (toCourse && participant && fees && fees.type) {
      const result = await transferParticipant({
        input: {
          participantId: participant.id,
          toCourseId: toCourse.id,
          fee: {
            type: fees.type,
            customFee: fees.customFee,
          },
          ...(isAddressInfoRequired({
            fromCourse: fromCourse as Course,
            toCourse,
          })
            ? virtualCourseParticipantAdress
            : {}),
          reason,
        },
      })

      const transferSuccessfully = result.data?.transferParticipant?.success

      if (
        transferSuccessfully &&
        mode !== TransferModeEnum.ATTENDEE_TRANSFERS
      ) {
        addSnackbarMessage('participant-transferred', {
          label: _t('pages.transfer-participant.success-message'),
        })

        navigate('../../details')
      } else if (transferSuccessfully) {
        completeStep(TransferStepsEnum.REVIEW)
        setSuccess(true)
      } else {
        setSuccess(false)
        setError(result.data?.transferParticipant?.error ?? 'Generic error')
      }
    }
  }

  if (!toCourse || !fees || !fromCourse?.level) {
    return <Navigate to={'../'} replace />
  }

  const courseLevel = fromCourse.level as unknown as Course_Level_Enum

  return (
    <Box>
      {success ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Alert sx={{ mb: 3 }} severity="success" variant="outlined">
            {t('review-transfer.success-message')}
          </Alert>

          <Typography variant="h4" mb={3}>
            {t('review-transfer.success-info')}
          </Typography>

          <Button variant="contained" component={LinkBehavior} href="/courses">
            {t('review-transfer.success-btn-text')}
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h4" mb={2}>
            {t('review-transfer.title')}
          </Typography>

          {error || networkError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t(`review-transfer.${error}`) ||
                t(`review-transfer.transferring-error`)}
            </Alert>
          ) : null}

          <Stack spacing="2px">
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
            {fees.customFee && fees.type === TransferFeeType.CustomFee ? (
              <>
                <InfoPanel data-testid="fee-type-panel">
                  <InfoRow
                    label={t('review-transfer.custom-fee')}
                    value={_t('currency', {
                      amount: fees.customFee,
                      currency: fromCourse.priceCurrency,
                    })}
                  />
                </InfoPanel>
                <InfoPanel data-testid="fee-vat-type-panel">
                  <InfoRow
                    label={t('review-transfer.vat')}
                    value={_t('currency', {
                      amount: new Big((fees.customFee * 20) / 100)
                        .round(2)
                        .toNumber(),
                      currency: fromCourse.priceCurrency,
                    })}
                  />
                </InfoPanel>
                <InfoPanel data-testid="amount-due-panel">
                  <InfoRow>
                    <Typography fontWeight={600}>
                      {_t('common.amount-due-custom-currency', {
                        currency: fromCourse.priceCurrency ?? 'GBP',
                      })}
                    </Typography>
                    <Typography fontWeight={600}>
                      {_t('currency', {
                        amount:
                          fees.customFee +
                          new Big((fees.customFee * 20) / 100)
                            .round(2)
                            .toNumber(),
                        currency: fromCourse.priceCurrency,
                      })}
                    </Typography>
                  </InfoRow>
                </InfoPanel>
              </>
            ) : null}

            {fees.type === TransferFeeType.ApplyTerms ? (
              <>
                <InfoPanel data-testid="fee-type-panel">
                  <InfoRow
                    label={t('transfer-details.apply-terms-option')}
                    value={t(
                      `transfer-details.${getTransferTermsFee(
                        new Date(fromCourse?.start ?? ''),
                        courseLevel
                      )}-fee${
                        isTrainTheTrainerCourse(courseLevel) ? '-trainer' : ''
                      }`
                    )}
                  />
                </InfoPanel>
                <InfoPanel>
                  <InfoRow data-testid="amount-due-panel">
                    <Typography fontWeight={600}>{_t('amount-due')}</Typography>
                    <Typography fontWeight={600}>
                      {t(
                        `transfer-details.${getTransferTermsFee(
                          new Date(fromCourse?.start ?? ''),
                          courseLevel
                        )}-fee${
                          isTrainTheTrainerCourse(courseLevel) ? '-trainer' : ''
                        }`
                      )}
                    </Typography>
                  </InfoRow>
                </InfoPanel>
              </>
            ) : null}
          </Stack>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              onClick={() => backFrom(TransferStepsEnum.REVIEW)}
              startIcon={<ArrowBack />}
            >
              {t(`review-transfer.back-btn-text_${mode}`)}
            </Button>
            <Box>
              {mode !== TransferModeEnum.ADMIN_TRANSFERS ? (
                <Button onClick={cancel} sx={{ mr: 2 }}>
                  {t('cancel-btn-text')}
                </Button>
              ) : null}
              <LoadingButton
                variant="contained"
                loading={fetching}
                onClick={handleParticipantTransfer}
                data-testid="confirm-transfer"
              >
                {t('review-transfer.submit-btn-text')}
              </LoadingButton>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
