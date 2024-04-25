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
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import {
  CertificateTypeEnum,
  FilterByCertificateType,
} from '@app/components/filters/FilterByCertificateType'
import { FilterByCertificateValidity } from '@app/components/filters/FilterByCertificateValidity'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByCourseType } from '@app/components/filters/FilterByCourseType'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
  Course_Type_Enum,
  Course_Certificate_Bool_Exp,
  CertificateStatus,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { CertificationsTable } from '@app/modules/certifications/components/CertificationsTable'
import useCertifications from '@app/modules/certifications/hooks/useCertifications'

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
  const [certificateType, setCertificateType] = useState<CertificateTypeEnum[]>(
    []
  )
  const [certificateStatus, setCertificateStatus] = useState<
    CertificateStatus[]
  >([])
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])

  const { acl } = useAuth()
  const [archived, setArchived] = useState<boolean>(false)

  const where = useMemo(() => {
    const conditions: Course_Certificate_Bool_Exp[] = []

    conditions.push({
      _or: [
        { participant: { completed_evaluation: { _eq: true } } },
        { legacyCourseCode: { _is_null: false, _neq: '' } },
      ],
    })

    if (keyword) {
      const query = keyword?.trim()

      const ilike = { _ilike: `${query}%` }
      conditions.push({
        _or: [
          { profile: { _or: [{ fullName: ilike }, { familyName: ilike }] } },
          { course: { course_code: ilike } },
          { number: ilike },
        ],
      })
    }

    if (filterType.length) {
      conditions.push({
        course: { type: { _in: filterType } },
      })
    }

    if (certificateType.length === 1) {
      conditions.push({
        legacyCourseCode: {
          _is_null: certificateType[0] === CertificateTypeEnum.Connect,
        },
      })
    }

    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0)
      conditions.push({ certificationDate: { _gte: from } })
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59)
      conditions.push({ certificationDate: { _lte: to } })
    }

    if (certificateStatus.length) {
      conditions.push({ status: { _in: certificateStatus } })
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
    certificateType,
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
    data: certificates,
    fetching,
    total,
  } = useCertifications({
    where,
    pagination: {
      limit,
      offset,
    },
  })

  const filtered =
    !!keyword ||
    !!dateFrom ||
    !!dateTo ||
    !!certificateStatus.length ||
    !!filterType.length ||
    !!filterLevel.length ||
    archived

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.user-profile.certifications')}
        </title>
      </Helmet>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('common.certifications')}</Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {fetching ? <>&nbsp;</> : t('x-items', { count: total })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />
            <FilterByDates
              onChange={onDatesChange}
              title={t('filters.date-obtained')}
            />
            <FilterByCourseType onChange={setFilterType} />
            <FilterByCertificateType onChange={setCertificateType} />
            <FilterByCertificateValidity onChange={setCertificateStatus} />
            <FilterByCourseLevel
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
          {fetching ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <CertificationsTable
                certificates={certificates ?? []}
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
