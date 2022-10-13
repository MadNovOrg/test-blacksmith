import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
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
import { useTransferParticipantContext } from '../TransferParticipantProvider'

export const TransferReview: React.FC = () => {
  const { t, _t } = useScopedTranslation('pages.transfer-participant')
  const navigate = useNavigate()
  const { profile } = useAuth()

  const { toCourse, fromCourse, fees, backFrom, participant } =
    useTransferParticipantContext()

  const [transferParticipantResult, transferParticipant] = useMutation<
    TransferParticipantMutation,
    TransferParticipantMutationVariables
  >(TRANSFER_PARTICIPANT)

  useEffect(() => {
    if (transferParticipantResult.data?.update_course_participant_by_pk?.id) {
      navigate('../../details?success=participant_transferred')
    }
  }, [transferParticipantResult.data, navigate])

  const handleTransfer = () => {
    if (toCourse && participant) {
      transferParticipant({
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
              courseCode: toCourse.course_code,
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
    }
  }

  if (!toCourse || !fees) {
    return <Navigate to={'../'} replace />
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('review-transfer.title')}
      </Typography>

      {transferParticipantResult.error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('review-transfer.transferring-error')}
        </Alert>
      ) : null}

      <Stack spacing="2px">
        <CourseInfoPanel
          course={{
            level: toCourse.level,
            startDate: toCourse.schedule[0].start,
            endDate: toCourse.schedule[0].end,
            venue: toCourse.schedule[0].venue,
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
                    new Date(toCourse.schedule[0].start)
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
                      new Date(toCourse.schedule[0].start)
                    )}-fee`
                  )}
                </Typography>
              </InfoRow>
            </InfoPanel>
          </>
        ) : null}
      </Stack>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button onClick={() => backFrom(TransferStepsEnum.REVIEW)}>
          {t('review-transfer.back-btn-text')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={transferParticipantResult.fetching}
          onClick={handleTransfer}
        >
          {t('review-transfer.submit-btn-text')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
