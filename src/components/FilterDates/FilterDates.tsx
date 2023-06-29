import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { isValid } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getI18n } from 'react-i18next'
import { DateParam, useQueryParam, withDefault } from 'use-query-params'

const { t } = getI18n()

const reasonToError: Record<string, string> = {
  minDate: t('components.filter-dates.validation.end-date-before-start-date'),
  maxDate: t('components.filter-dates.validation.start-date-after-end-date'),
  invalidDate: t('components.filter-dates.validation.invalid-date'),
}

const getErrorMessage = (reason: string): string => reasonToError[reason] || ''

type Props = {
  title: string
  queryParam?: string
  onChange: (from?: Date, to?: Date) => void
} & Omit<BoxProps, 'onChange'>

export const FilterDates: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
  title,
  queryParam = '',
  ...props
}) => {
  const { t } = useTranslation()

  const [from, setFrom] = useQueryParam(
    `dateFrom${queryParam}`,
    withDefault(DateParam, null)
  )
  const [to, setTo] = useQueryParam(
    `dateTo${queryParam}`,
    withDefault(DateParam, null)
  )

  const [fromError, setFromError] = useState<string>('')
  const [toError, setToError] = useState<string>('')

  useEffect(() => {
    if (!fromError && !toError) {
      onChange(from ?? undefined, to ?? undefined)
    }
  }, [from, fromError, onChange, to, toError])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Box display="flex" flexDirection="column" gap={1} {...props}>
        <Typography variant="body2" fontWeight="bold">
          {title}
        </Typography>

        <DatePicker
          value={from}
          onChange={d => {
            if (isValid(d)) setFrom(d)
            else setFromError('invalidDate')
          }}
          maxDate={to || undefined}
          onError={reason => setFromError(reason?.toString() || '')}
          slotProps={{
            textField: {
              // @ts-expect-error no arbitrary props are allowed by types, which is wrong
              'data-testid': 'DateFrom',
              label: t('common.from'),
              variant: 'standard',
              fullWidth: true,
              error: fromError !== '',
              helperText: getErrorMessage(fromError),
            },
          }}
        />

        <DatePicker
          value={to}
          onChange={d => {
            if (isValid(d)) setTo(d)
            else setToError('invalidDate')
          }}
          minDate={from || undefined}
          onError={reason => setToError(reason?.toString() || '')}
          slotProps={{
            textField: {
              // @ts-expect-error no arbitrary props are allowed by types, which is wrong
              'data-testid': 'DateTo',
              label: t('common.to'),
              variant: 'standard',
              fullWidth: true,
              error: toError !== '',
              helperText: getErrorMessage(toError),
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  )
}
