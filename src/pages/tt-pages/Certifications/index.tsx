import {
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Stack,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificationList } from '@app/components/CertificationList'
import { FilterCertificateValidity } from '@app/components/FilterCertificateValidity'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterDates } from '@app/components/FilterDates'
import { FilterSearch } from '@app/components/FilterSearch'
import {
  Course_Participant_Bool_Exp,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { CertificateStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { useAuth } from '../../../context/auth'

type CertificationsProps = unknown

export const Certifications: React.FC<
  React.PropsWithChildren<CertificationsProps>
> = () => {
  const { t } = useTranslation()

  const sorting = useTableSort('name', 'asc')

  const [keyword, setKeyword] = useState('')

  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const onDatesChange = useCallback((from?: Date, to?: Date) => {
    setDateFrom(from)
    setDateTo(to)
  }, [])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [certificateStatus, setCertificateStatus] = useState<
    CertificateStatus[]
  >([])
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])

  const { acl } = useAuth()
  const [archived, setArchived] = useState<boolean>(false)

  const where = useMemo(() => {
    const conditions: Course_Participant_Bool_Exp[] = [
      { certificate: { id: { _is_null: false } } },
    ]

    if (keyword) {
      const query = keyword?.trim()

      const ilike = { _ilike: `${query}%` }
      conditions.push({
        _or: [
          { profile: { _or: [{ fullName: ilike }, { familyName: ilike }] } },
          { course: { _or: [{ course_code: ilike }] } },
        ],
      })
    }

    if (filterType.length) {
      conditions.push({
        course: { type: { _in: filterType } },
      })
    }

    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0)
      conditions.push({ certificate: { certificationDate: { _gte: from } } })
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59)
      conditions.push({ certificate: { certificationDate: { _lte: to } } })
    }

    if (certificateStatus.length) {
      conditions.push({ certificate: { status: { _in: certificateStatus } } })
    }

    conditions.push({
      profile: {
        archived: { _eq: archived },
      },
    })

    if (filterLevel.length) {
      conditions.push({
        course: { level: { _in: filterLevel } },
      })
    }

    return {
      _and: conditions,
    }
  }, [
    keyword,
    filterType,
    dateFrom,
    dateTo,
    certificateStatus,
    archived,
    filterLevel,
  ])

  const { Pagination, limit, offset } = useTablePagination({
    initialPerPage: 20,
  })

  const {
    data: participants,
    status,
    total,
  } = useCourseParticipants(undefined, {
    sortBy: sorting.by,
    order: sorting.dir,
    where,
    pagination: {
      limit,
      offset,
    },
  })

  const loading = status === LoadingStatus.FETCHING
  const filtered =
    !!keyword ||
    !!dateFrom ||
    !!dateTo ||
    !!certificateStatus.length ||
    !!filterType.length ||
    !!filterLevel.length ||
    archived
  const count = participants?.length ?? 0

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('common.certifications')}</Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />
            <FilterDates
              onChange={onDatesChange}
              title={t('filters.date-obtained')}
            />
            <FilterCourseType onChange={setFilterType} />
            <FilterCertificateValidity onChange={setCertificateStatus} />
            <FilterCourseLevel
              title={t('course-level')}
              onChange={setFilterLevel}
            />

            {acl.canViewArchivedUsersCertificates() && (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => setArchived(e.target.checked)}
                    data-testid="FilterArchived"
                  />
                }
                label={t('filters.archived')}
              />
            )}
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
            <>
              <CertificationList
                columns={[
                  'name',
                  'certificate',
                  'course-code',
                  'status',
                  'date-expired',
                  'date-obtained',
                  'organisation',
                ]}
                hideTitle={true}
                participants={participants ?? []}
                sorting={sorting}
                filtered={filtered}
              />

              {total ? (
                <Pagination
                  total={total}
                  rowsPerPage={[20, 30, 40, 50, 100, 200]}
                />
              ) : null}
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}
