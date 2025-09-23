import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@mui/material'
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@app/components/BackButton'
import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import {
  Course_Level_Enum,
  Course_Pricing,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import {
  ChangelogModal,
  PriceActionsModal,
  PricingFilters,
} from '@app/modules/admin/Pricing/components'
import { useCoursePricing } from '@app/modules/admin/Pricing/hooks'
import theme from '@app/theme'

import { getCourseAttributes } from '../utils'

type Filters = {
  type?: Course_Type_Enum[]
  levels?: Course_Level_Enum[]
  blended?: boolean
  reaccreditation?: boolean
}

export const PricingList: React.FC = () => {
  const { t } = useTranslation()

  const { Pagination, limit, offset } = useTablePagination()
  const [filters, setFilters] = useState<Filters>({})
  const { coursePricing, total, isLoading, mutate } = useCoursePricing({
    filters,
    limit,
    offset,
  })

  const onFilterChange = useCallback((next: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...next }))
  }, [])

  const loading = isLoading
  const filtered =
    !!filters.type?.length ||
    !!filters.levels?.length ||
    !!filters.blended ||
    !!filters.reaccreditation
  const count = total

  const [selectedEditPrice, setSelectedEditPrice] =
    useState<Course_Pricing | null>(null)

  const showEditPriceModal = Boolean(selectedEditPrice)

  const [selectedChangeLog, setSelectedChangeLog] =
    useState<Course_Pricing | null>(null)

  const showChangelogModal = Boolean(selectedChangeLog)

  const columns = useMemo(
    () => ['course', 'type', 'attributes', 'modified', 'price', 'actions'],
    [],
  )

  const colsToShow: Set<string> = useMemo(() => new Set(columns), [columns])
  const showCol = useCallback((id: string) => colsToShow.has(id), [colsToShow])

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.course-pricing.cols-${col}`)
    const col = (id: string, extra?: Partial<Col>, check = true) => {
      return !check || showCol(id) ? [{ id: id, label: _t(id), ...extra }] : []
    }

    return [
      ...col('course'),
      ...col('type'),
      ...col('attributes'),
      ...col('actions', {}, false),
    ] as Col[]
  }, [t, showCol])

  return (
    <FullHeightPageLayout>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton label={t('pages.admin.back-to-settings')} to="/admin" />

          <Typography variant="h1" py={2} fontWeight={600}>
            {t('pages.course-pricing.title')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" gap={4}>
          <Box width={250}>
            <Typography variant="body2" color="grey.600" mt={1}>
              {loading ? <>&nbsp;</> : t('x-items', { count })}
            </Typography>

            <Stack gap={4} mt={4}>
              <PricingFilters onChange={onFilterChange} />
            </Stack>
          </Box>
          <Box flex={1}>
            <Table>
              <TableHead cols={cols} />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={cols.length}>
                      <Stack direction="row" alignItems="center">
                        <CircularProgress size={20} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : null}

                <TableNoRows
                  noRecords={!loading && !coursePricing.length}
                  filtered={filtered}
                  itemsName={t('pages.course-pricing.title').toLowerCase()}
                  colSpan={cols.length}
                />

                {coursePricing.map(pricing => (
                  <TableRow key={pricing?.id}>
                    <TableCell>
                      {t(`course-levels.${pricing?.level}`)}
                    </TableCell>
                    <TableCell>{t(`course-types.${pricing?.type}`)}</TableCell>
                    <TableCell>{getCourseAttributes(t, pricing)}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          sx={{ whiteSpace: 'nowrap' }}
                          onClick={() => {
                            setSelectedEditPrice(pricing)
                          }}
                          startIcon={<EditIcon />}
                        >
                          {t('pages.course-pricing.edit-pricing')}
                        </Button>
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          sx={{ whiteSpace: 'nowrap', ml: 1 }}
                          onClick={() => {
                            setSelectedChangeLog(pricing)
                          }}
                          startIcon={<HistoryIcon />}
                        >
                          {t('pages.course-pricing.view-history')}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {total ? <Pagination total={total} /> : null}

            {showEditPriceModal ? (
              <PriceActionsModal
                pricing={selectedEditPrice}
                onClose={() => setSelectedEditPrice(null)}
                onSave={() => {
                  setSelectedEditPrice(null)
                  mutate()
                }}
              />
            ) : null}

            {showChangelogModal ? (
              <ChangelogModal
                coursePricing={selectedChangeLog}
                onClose={() => setSelectedChangeLog(null)}
              />
            ) : null}
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
