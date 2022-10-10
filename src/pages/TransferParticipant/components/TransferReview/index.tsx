import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { FeeType, TransferStepsEnum } from '../../types'
import { getTransferTermsFee } from '../../utils'
import { CourseInfoPanel } from '../CourseInfoPanel'
import { useTransferParticipantContext } from '../TransferParticipantProvider'

export const TransferReview: React.FC = () => {
  const { t, _t } = useScopedTranslation('pages.transfer-participant')

  const { toCourse, fees, backFrom } = useTransferParticipantContext()

  if (!toCourse) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('review-transfer.title')}
      </Typography>

      <Stack spacing="2px">
        <CourseInfoPanel
          course={{
            level: toCourse.level,
            startDate: toCourse.schedule[0].start,
            endDate: toCourse.schedule[0].end,
            venue: toCourse.schedule[0].venue,
          }}
        />
        {fees?.customFee && fees.type === FeeType.CUSTOM_FEE ? (
          <>
            <InfoPanel>
              <InfoRow
                label={t('review-transfer.custom-fee')}
                value={_t('currency', { amount: fees.customFee })}
              />
            </InfoPanel>
            <InfoPanel>
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

        {fees?.type === FeeType.APPLY_TERMS ? (
          <>
            <InfoPanel>
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
              <InfoRow>
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
        <LoadingButton variant="contained">
          {t('review-transfer.submit-btn-text')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
