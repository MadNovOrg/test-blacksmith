import { ArrowBack } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import {
  Course_Participant_Audit_Type_Enum,
  TransferParticipantMutation,
  TransferParticipantMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { TRANSFER_PARTICIPANT } from '../../queries'
import { FeeType, TransferStepsEnum } from '../../types'
import { getTransferTermsFee } from '../../utils'
import { CourseInfoPanel } from '../CourseInfoPanel'
import {
  TransferModeEnum,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

export const TransferReview: React.FC = () => {
  const { t, _t } = useScopedTranslation('pages.transfer-participant')
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [success, setSuccess] = useState<boolean | undefined>()

  const {
    toCourse,
    fromCourse,
    fees,
    backFrom,
    participant,
    mode,
    completeStep,
    cancel,
  } = useTransferParticipantContext()

  const [{ error, fetching }, transferParticipant] = useMutation<
    TransferParticipantMutation,
    TransferParticipantMutationVariables
  >(TRANSFER_PARTICIPANT)

  const handleTransfer = async () => {
    if (toCourse && participant) {
      try {
        const result = await transferParticipant({
          participantId: participant?.id,
          courseId: toCourse?.id,
          auditInput: {
            authorized_by: profile?.id,
            type: Course_Participant_Audit_Type_Enum.Transfer,
            course_id: fromCourse?.id,
            profile_id: profile?.id,
            payload: {
              fromCourse: {
                id: fromCourse?.id,
                courseCode: fromCourse?.course_code,
              },
              toCourse: {
                id: toCourse?.id,
                courseCode: toCourse.courseCode,
              },
              type: fees?.type,
              ...(fees?.type === FeeType.APPLY_TERMS
                ? {
                    percentage: getTransferTermsFee(
                      new Date(fromCourse?.start ?? '')
                    ),
                  }
                : null),
              ...(fees?.type === FeeType.CUSTOM_FEE
                ? { customFee: fees.customFee }
                : null),
            },
          },
        })

        const transferSuccessfull =
          result.data?.update_course_participant_by_pk?.id

        if (
          transferSuccessfull &&
          mode !== TransferModeEnum.ATTENDEE_TRANSFERS
        ) {
          navigate('../../details?success=participant_transferred')
        } else if (transferSuccessfull) {
          completeStep(TransferStepsEnum.REVIEW)
          setSuccess(true)
        }
      } catch (err) {
        // declaratively doing error handling from useMutation
        console.error(err)
      }
    }
  }

  if (!toCourse || !fees) {
    return <Navigate to={'../'} replace />
  }

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

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('review-transfer.transferring-error')}
            </Alert>
          ) : null}

          <Stack spacing="2px">
            <CourseInfoPanel
              course={{
                courseCode: toCourse.courseCode,
                startDate: toCourse.startDate,
                endDate: toCourse.endDate,
                venue: toCourse.venue ?? '',
              }}
            />
            {fees.customFee && fees.type === FeeType.CUSTOM_FEE ? (
              <>
                <InfoPanel data-testid="fee-type-panel">
                  <InfoRow
                    label={t('review-transfer.custom-fee')}
                    value={_t('currency', { amount: fees.customFee })}
                  />
                </InfoPanel>
                <InfoPanel data-testid="amount-due-panel">
                  <InfoRow>
                    <Typography fontWeight={600}>
                      {_t('amount-due-currency')}
                    </Typography>
                    <Typography fontWeight={600}>
                      {_t('currency', { amount: fees.customFee })}
                    </Typography>
                  </InfoRow>
                </InfoPanel>
              </>
            ) : null}

            {fees.type === FeeType.APPLY_TERMS ? (
              <>
                <InfoPanel data-testid="fee-type-panel">
                  <InfoRow
                    label={t('transfer-details.apply-terms-option')}
                    value={t(
                      `transfer-details.${getTransferTermsFee(
                        new Date(fromCourse?.start ?? '')
                      )}-fee`
                    )}
                  />
                </InfoPanel>
                <InfoPanel>
                  <InfoRow data-testid="amount-due-panel">
                    <Typography fontWeight={600}>{_t('amount-due')}</Typography>
                    <Typography fontWeight={600}>
                      {t(
                        `transfer-details.${getTransferTermsFee(
                          new Date(fromCourse?.start ?? '')
                        )}-fee`
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
                onClick={handleTransfer}
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
