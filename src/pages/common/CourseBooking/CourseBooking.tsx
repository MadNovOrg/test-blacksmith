import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { StepsNavigation } from '@app/components/StepsNavigation'
import { Sticky } from '@app/components/Sticky'
import { UnverifiedLayout } from '@app/components/UnverifiedLayout'

export const CourseBookingPage: React.FC = () => {
  const { t } = useTranslation()
  const [qty, setQty] = useState(2)
  const [emails, setEmails] = useState<string[]>([])

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

  const qtyOptions = useMemo(() => [1, 2, 3], [])

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
              completedSteps={[]}
              steps={steps}
              data-testid="create-course-nav"
            />
          </Sticky>
        </Box>

        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="500">
            {t('pages.book-course.order-details')}
          </Typography>

          <Box bgcolor="common.white" p={2} mb={4}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box>
                <Typography gutterBottom fontWeight="600">
                  Level One - 6 Hour
                </Typography>
                <Typography gutterBottom color="grey.700">
                  Wed, 19 May 2022
                </Typography>
                <Typography gutterBottom color="grey.700">
                  9:30 AM-4:00 PM
                </Typography>
              </Box>
              <Box minWidth={100} display="flex" alignItems="center" mr={-2}>
                <FormControl fullWidth sx={{ bgcolor: 'grey.200' }}>
                  <InputLabel variant="standard" htmlFor="qty-select">
                    {t('qty')}
                  </InputLabel>
                  <NativeSelect
                    defaultValue={30}
                    inputProps={{ name: 'qty', id: 'qty-select' }}
                    onChange={e => setQty(+e.target.value)}
                  >
                    {qtyOptions.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <IconButton
                  aria-label="delete"
                  onClick={() => console.log('TBD')}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('subtotal')}</Typography>
              <Typography color="grey.700">$ 123.45</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">{t('vat')} (20%)</Typography>
              <Typography color="grey.700">$ 24.5</Typography>
            </Box>

            <Box my={3} display="flex" justifyContent="flex-end" mr={-1}>
              <Button
                size="small"
                variant="text"
                color="primary"
                sx={{ fontWeight: '600' }}
              >
                {t('pages.book-course.apply-promo')}
              </Button>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="500" color="primary">
                {t('amount-due')} (GBP)
              </Typography>
              <Typography fontWeight="500" color="primary">
                $ 145.50
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight="500">
            {t('registration')}
          </Typography>
          <Box bgcolor="common.white" p={2} mb={4}>
            <Autocomplete
              multiple
              id="emails"
              options={[] as string[]}
              defaultValue={[]}
              freeSolo
              onChange={(_, v) => setEmails(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  // disable key rule because getTagProps already sets correct key
                  // eslint-disable-next-line react/jsx-key
                  <Chip
                    variant="filled"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Enter registrant email(s)"
                  placeholder="Emails"
                  inputProps={{ ...params.inputProps, sx: { height: 40 } }}
                  sx={{ bgcolor: 'grey.100' }}
                />
              )}
            />
            <Box display="flex" justifyContent="space-between">
              <FormHelperText>
                {emails.length} / {qty}
              </FormHelperText>
              {emails.length > qty && (
                <FormHelperText error>
                  {t('validation-errors.max-registrants', { num: qty })}
                </FormHelperText>
              )}
            </Box>

            <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
              <b>{t('important')}:</b> {t('pages.book-course.notice')}
            </Alert>
          </Box>

          <Typography variant="subtitle1" fontWeight="500">
            {t('pages.book-course.payment-details')}
          </Typography>
          <Box bgcolor="common.white" p={2} mb={4}>
            <FormControl
              sx={{
                '& .MuiRadio-root': {
                  paddingY: 0,
                },

                '& .MuiFormControlLabel-root': {
                  alignItems: 'flex-start',
                  mb: 2,
                },
              }}
            >
              <FormLabel id="payment-method" sx={{ mb: 2, fontWeight: '600' }}>
                {t('pages.book-course.payment-method')}
              </FormLabel>
              <RadioGroup
                aria-labelledby="payment-method"
                name="controlled-radio-buttons-group"
                value={'cc'}
                onChange={() => console.log('TBD')}
              >
                <FormControlLabel
                  value="cc"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography gutterBottom fontWeight="500">
                        {t('pages.book-course.pay-by-cc')}
                      </Typography>
                      <Typography variant="body2" color="grey.700">
                        {t('pages.book-course.pay-by-cc-info')}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="invoice"
                  control={<Radio />}
                  disabled
                  label={
                    <Box>
                      <Typography gutterBottom fontWeight="500">
                        {t('pages.book-course.pay-by-inv')}
                      </Typography>
                      <Typography variant="body2" color="grey.700">
                        {t('pages.book-course.pay-by-inv-info')}
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button variant="text" color="primary">
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={LinkBehavior}
              href="review"
            >
              {t('pages.book-course.step-2')}
            </Button>
          </Box>
        </Box>
      </Box>
    </UnverifiedLayout>
  )
}
