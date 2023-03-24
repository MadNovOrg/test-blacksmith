import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { InvoiceDetails } from '@app/components/InvoiceDetails'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { LoadingStatus } from '@app/util'

import { StepsEnum } from '../../types'
import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

export const ReviewLicenseOrder: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { go1Licensing, courseData, setCurrentStepKey } = useCreateCourse()
  const { saveCourse, savingStatus } = useSaveCourse()

  const hasSavingError = savingStatus === LoadingStatus.ERROR

  const { _t, t } = useScopedTranslation(
    'pages.create-course.license-order-review'
  )
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentStepKey(StepsEnum.REVIEW_AND_CONFIRM)
  }, [setCurrentStepKey])

  const handleSubmitButtonClick = async () => {
    const courseId = await saveCourse()

    if (courseId) {
      navigate(`/courses/${courseId}/modules`)
    }
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500" mb={2}>
        {t('title')}
      </Typography>

      {hasSavingError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('saving-error-message')}
        </Alert>
      ) : null}

      {!courseData || !go1Licensing ? (
        <Alert
          severity="error"
          variant="outlined"
          data-testid="license-order-details-not-found"
        >
          {_t('pages.create-course.course-not-found')}
        </Alert>
      ) : null}

      <Stack spacing="2px">
        {courseData ? (
          <InfoPanel
            title={`${_t('common.blended-learning')} - ${_t(
              `common.course-levels.${courseData.courseLevel}`
            )}`}
          >
            <InfoRow
              label={`${_t('dates.long', {
                date: courseData.startDateTime,
              })} - ${_t('dates.long', {
                date: courseData.endDateTime,
              })}`}
            />
            <InfoRow
              label={_t('dates.timeFromTo', {
                from: courseData.startDateTime,
                to: courseData.endDateTime,
              })}
            />
          </InfoPanel>
        ) : null}

        {go1Licensing ? (
          <>
            <InfoPanel title={_t('common.payment-method')}>
              <InfoRow label={_t('common.pay-by-inv')}></InfoRow>
            </InfoPanel>
            <InfoPanel>
              <InvoiceDetails details={go1Licensing.invoiceDetails} />
            </InfoPanel>
          </>
        ) : null}

        <InfoPanel>
          <InfoRow
            label={_t('common.subtotal')}
            value={_t('common.currency', {
              amount: go1Licensing?.prices.subtotal,
            })}
          />
          {go1Licensing?.prices.vat ? (
            <InfoRow
              label={_t('common.vat')}
              value={_t('common.currency', {
                amount: go1Licensing.prices.vat,
              })}
            />
          ) : null}
        </InfoPanel>
        <InfoPanel>
          <InfoRow>
            <Typography fontWeight="600">{_t('common.amount-due')}</Typography>
            <Typography fontWeight="600">
              {_t('common.currency', {
                amount: go1Licensing?.prices.amountDue,
              })}
            </Typography>
          </InfoRow>
        </InfoPanel>
      </Stack>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4, mb: 4 }}>
        <Button
          onClick={() => navigate(`../license-order-details?type=INDIRECT`)}
          startIcon={<ArrowBackIcon />}
        >
          {t('back-btn-text')}
        </Button>

        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            loading={savingStatus === LoadingStatus.FETCHING}
            onClick={() => handleSubmitButtonClick()}
            data-testid="courseBuilder-button"
          >
            {_t('pages.create-course.course-builder-button-text')}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
