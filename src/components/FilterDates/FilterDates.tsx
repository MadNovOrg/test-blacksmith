import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enLocale from 'date-fns/locale/en-GB'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getI18n } from 'react-i18next'

const { t } = getI18n()

const reasonToError: Record<string, string> = {
  minDate: t('components.filter-dates.validation.end-date-before-start-date'),
  maxDate: t('components.filter-dates.validation.start-date-after-end-date'),
  invalidDate: t('components.filter-dates.validation.invalid-date'),
}

const getErrorMessage = (reason: string): string => reasonToError[reason] || ''

type Props = {
  onChange: (from?: Date, to?: Date) => void
}

export const FilterDates: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation()

  const [from, setFrom] = useState<Date | null>(null)
  const [to, setTo] = useState<Date | null>(null)

  const [fromError, setFromError] = useState<string>('')
  const [toError, setToError] = useState<string>('')

  useEffect(() => {
    if (!fromError && !toError) {
      onChange(from ?? undefined, to ?? undefined)
    }
  }, [from, fromError, onChange, to, toError])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="body2" fontWeight="bold">
          {t('filters.date-range')}
        </Typography>

        <DatePicker
          value={from}
          onChange={setFrom}
          maxDate={to || undefined}
          onError={reason => setFromError(reason?.toString() || '')}
          renderInput={params => (
            <TextField
              {...params}
              data-testid="DateFrom"
              label={t('common.from')}
              variant="standard"
              fullWidth
              error={fromError !== ''}
              helperText={getErrorMessage(fromError)}
            />
          )}
        />

        <DatePicker
          value={to}
          onChange={setTo}
          minDate={from || undefined}
          onError={reason => setToError(reason?.toString() || '')}
          renderInput={params => (
            <TextField
              {...params}
              data-testid="DateTo"
              label={t('common.to')}
              variant="standard"
              fullWidth
              error={toError !== ''}
              helperText={getErrorMessage(toError)}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  )
}
