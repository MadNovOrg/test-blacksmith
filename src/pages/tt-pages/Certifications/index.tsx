import { CircularProgress, Container, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificationList } from '@app/components/CertificationList'
import { FilterDates } from '@app/components/FilterDates'
import { FilterSearch } from '@app/components/FilterSearch'
import useCourseParticipants, {
  CourseParticipantCriteria,
} from '@app/hooks/useCourseParticipants'
import { useTableSort } from '@app/hooks/useTableSort'
import { LoadingStatus } from '@app/util'

type CertificationsProps = unknown

export const Certifications: React.FC<CertificationsProps> = () => {
  const { t } = useTranslation()

  const sorting = useTableSort('name', 'asc')

  const [keyword, setKeyword] = useState('')

  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const onDatesChange = useCallback((from?: Date, to?: Date) => {
    setDateFrom(from)
    setDateTo(to)
  }, [])

  const where = useMemo(() => {
    const conditions: CourseParticipantCriteria[] = [
      { certificate: { id: { _is_null: false } } },
    ]

    if (keyword) {
      const ilike = { _ilike: `${keyword}%` }
      conditions.push({
        profile: { _or: [{ fullName: ilike }, { familyName: ilike }] },
      })
    }

    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0)
      conditions.push({ certificate: { expiryDate: { _gte: from } } })
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59)
      conditions.push({ certificate: { expiryDate: { _lte: to } } })
    }

    return { _and: conditions }
  }, [keyword, dateFrom, dateTo])

  const { data: participants, status } = useCourseParticipants(undefined, {
    sortBy: sorting.by,
    order: sorting.dir,
    where,
  })

  const loading = status === LoadingStatus.FETCHING
  const filtered = !!keyword || !!dateFrom || !!dateTo
  const count = participants?.length ?? 0

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('common.certifications')}</Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />
            <FilterDates onChange={onDatesChange} />
          </Stack>
        </Box>

        <Box flex={1}>
          {loading ? (
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
              participants={participants ?? []}
              sorting={sorting}
              filtered={filtered}
            />
          )}
        </Box>
      </Box>
    </Container>
  )
}
