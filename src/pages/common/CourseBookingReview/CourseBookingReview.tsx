import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@app/components/BackButton'
import { StepsNavigation } from '@app/components/StepsNavigation'
import { Sticky } from '@app/components/Sticky'
import { UnverifiedLayout } from '@app/components/UnverifiedLayout'

export const CourseBookingReviewPage: React.FC = () => {
  const { t } = useTranslation()

  const [accept, setAccept] = useState(false)

  const steps = useMemo(() => {
    return [
      {
        key: 'book',
        label: t('pages.book-course.step-1'),
      },
      {
        key: 'review',
        label: t('pages.book-course.step-2'),
      },
    ]
  }, [t])

  return (
    <UnverifiedLayout>
      <Box flex={1} display="flex">
        <Box width={300} display="flex" flexDirection="column" pr={4}>
          <Sticky top={20}>
            <Box mb={7}>
              <Typography variant="h2" mb={2}>
                {t('pages.book-course.title')}
              </Typography>

              <Typography color="grey.700">{t('validation-notice')}</Typography>
            </Box>

            <StepsNavigation
              completedSteps={['book']}
              steps={steps}
              data-testid="create-course-nav"
            />
          </Sticky>
        </Box>

        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="500">
            {t('pages.book-course.confirm-title')}
          </Typography>
          <Box bgcolor="common.white" p={2} mb={1}>
            <Typography gutterBottom fontWeight="600">
              {t('pages.book-course.your-info')}
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('first-name')}</Typography>
              <Typography>Salman</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('last-name')}</Typography>
              <Typography>Mitha</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('email')}</Typography>
              <Typography>salman.mitha@nearform.com</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('work-phone')}</Typography>
              <Typography>+44 123456789</Typography>
            </Box>
          </Box>

          <Box bgcolor="common.white" p={2} mb={3}>
            <Typography gutterBottom fontWeight="600">
              {t('pages.book-course.order-summary')}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography gutterBottom fontWeight="600">
                  Level One - 6 Hour
                </Typography>
                <Typography gutterBottom color="grey.700">
                  Wed, 19 May 2022
                </Typography>
                <Typography color="grey.700">9:30 AM-4:00 PM</Typography>
              </Box>
              <Stack alignItems="flex-end">
                <Typography variant="caption" gutterBottom color="grey.700">
                  {t('qty')}
                </Typography>
                <Typography>2</Typography>
              </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom fontWeight="600">
              {t('pages.book-course.payment-method')}
            </Typography>
            <Typography color="grey.700">
              {t('pages.book-course.pay-by-cc')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom fontWeight="600">
              {t('registrants')}
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">
                salman.mitha@nearform.com
              </Typography>
              <Typography color="grey.700">$ 12.45</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">john.rambo@example.com</Typography>
              <Typography color="grey.700">$ 12.45</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('subtotal')}</Typography>
              <Typography color="grey.700">$ 24.90</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('vat')} (20%)</Typography>
              <Typography color="grey.700">$ 4.8</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">
                {t('promo-code')}: WELCOME10
              </Typography>
              <Typography color="grey.700">- $ 10.00</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="500">{t('amount-due')} (GBP)</Typography>
              <Typography fontWeight="500">$ 145.50</Typography>
            </Box>
          </Box>

          <FormControlLabel
            sx={{
              alignItems: 'flex-start',
              '& .MuiCheckbox-root': { paddingY: 0 },
            }}
            control={
              <Checkbox
                onChange={(_, checked) => setAccept(checked)}
                checked={accept}
              />
            }
            label={
              <Typography variant="body2">
                {t('pages.book-course.review-tnc')}
              </Typography>
            }
          />

          <Box display="flex" justifyContent="space-between" mt={4}>
            <BackButton label={'Back to booking details'} />
            <Button variant="contained" color="primary">
              {t('pages.book-course.complete-booking')}
            </Button>
          </Box>
        </Box>
      </Box>
    </UnverifiedLayout>
  )
}
