import ClearIcon from '@mui/icons-material/Clear'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { CircularProgress, Container, IconButton, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import { CertificationList } from '@app/components/CertificationList'
import useCourseParticipants, {
  CourseParticipantCriteria,
} from '@app/hooks/useCourseParticipants'
import { SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

type CertificationsProps = unknown

export const Certifications: React.FC<CertificationsProps> = () => {
  const { t } = useTranslation()

  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const handleSortChange = useCallback(
    columnName => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn]
  )

  const where = useMemo(() => {
    const conditions: CourseParticipantCriteria[] = [
      {
        certificate: { id: { _is_null: false } },
      },
    ]
    if (keywordDebounced) {
      conditions.push({
        profile: {
          fullName: { _ilike: `%${keywordDebounced}%` },
        },
      })
    }
    if (dateFrom) {
      conditions.push({
        certificate: { expiryDate: { _gte: dateFrom } },
      })
    }
    if (dateTo) {
      conditions.push({
        certificate: { expiryDate: { _lte: dateTo } },
      })
    }
    return {
      _and: conditions,
    }
  }, [keywordDebounced, dateFrom, dateTo])

  const sortingOptions = useMemo(
    () => ({
      order,
      orderBy: sortColumn,
      onSort: handleSortChange,
    }),
    [order, sortColumn, handleSortChange]
  )

  const { data: certifiedParticipants, status } = useCourseParticipants(
    undefined,
    {
      sortBy: 'name',
      order,
      where,
    }
  )

  return (
    <Container maxWidth="lg" sx={{ pt: 6 }}>
      <Box display="flex">
        <Box width={300} display="flex" flexDirection="column" pr={4}>
          <Typography variant="h1">{t('common.certifications')}</Typography>
          <Typography variant="body2" color="grey.500" pt={1}>
            {certifiedParticipants?.length ?? 0} {t('common.items')}
          </Typography>

          <Box display="flex" flexDirection="column" pt={5} gap={4}>
            <TextField
              type="text"
              label={t('common.search')}
              value={keyword}
              variant="standard"
              size="small"
              data-testid="search-certificate"
              onChange={e => setKeyword(e.target.value)}
              InputProps={{
                endAdornment: keyword && (
                  <IconButton onClick={() => setKeyword('')}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2">
                  {t('common.date-range')}
                </Typography>
                <DatePicker
                  clearable
                  clearText={t('common.clear')}
                  value={dateFrom ?? null}
                  onChange={d => setDateFrom(d ?? undefined)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('common.from')}
                      variant="standard"
                      fullWidth
                      data-testid="search-certificate-date-from"
                    />
                  )}
                />
                <DatePicker
                  clearable
                  value={dateTo ?? null}
                  onChange={d => setDateTo(d ?? undefined)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('common.to')}
                      variant="standard"
                      fullWidth
                      data-testid="search-certificate-date-to"
                    />
                  )}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Box>

        <Box flex={1}>
          {status === LoadingStatus.FETCHING ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <CertificationList
              columns={['name', 'certificate', 'status']}
              hideTitle={true}
              participants={certifiedParticipants ?? []}
              sortingOptions={sortingOptions}
            />
          )}
        </Box>
      </Box>
    </Container>
  )
}
