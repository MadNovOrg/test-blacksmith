import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import enLocale from 'date-fns/locale/en-GB'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  onChange: (from?: Date, to?: Date) => void
}

export const FilterDates: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation()

  const [from, setFrom] = useState<Date | null>(null)
  const [to, setTo] = useState<Date | null>(null)

  useEffect(() => {
    onChange(from ?? undefined, to ?? undefined)
  }, [from, to, onChange])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="body2" fontWeight="bold">
          {t('filters.date-range')}
        </Typography>

        <DatePicker
          clearable
          clearText={t('common.clear')}
          value={from}
          onChange={setFrom}
          renderInput={params => (
            <TextField
              {...params}
              data-testid="DateFrom"
              label={t('common.from')}
              variant="standard"
              fullWidth
            />
          )}
        />

        <DatePicker
          clearable
          clearText={t('common.clear')}
          value={to}
          onChange={setTo}
          renderInput={params => (
            <TextField
              {...params}
              label={t('common.to')}
              variant="standard"
              fullWidth
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  )
}
