import { Box, Button, Container, Stack, Typography } from '@mui/material'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'

import { Filters } from './Filters'
import { PendingApproval } from './PendingApproval'
import { DiscountsTable } from './Table'
type Filters = { from?: Date; to?: Date; type?: string[]; code?: string }

export const DiscountsList: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { Pagination, limit, offset } = useTablePagination()
  const sorting = useTableSort('createdAt', 'asc')
  const [filters, setFilters] = useState<Filters>({})

  const { promoCodes, total, isLoading } = usePromoCodes({
    sort: { by: sorting.by, dir: sorting.dir },
    filters,
    limit,
    offset,
  })

  const onFilterChange = useCallback((next: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...next }))
  }, [])

  const loading = isLoading
  const filtered = !!filters.from || !!filters.to
  const count = promoCodes.length ?? 0

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('pages.promoCodes.title')}</Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <Filters onChange={onFilterChange} />
          </Stack>
        </Box>

        <Box flex={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box sx={{ alignSelf: 'flex-end', position: 'relative', top: 10 }}>
              <Typography fontWeight="bold">
                {t('pages.promoCodes.list-title-pending')}
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate('./new')}>
              {t('pages.promoCodes.new-btn')}
            </Button>
          </Box>

          <PendingApproval />

          <DiscountsTable
            promoCodes={promoCodes}
            sorting={sorting}
            loading={isLoading}
            filtered={filtered}
          />

          <Pagination total={total} />
        </Box>
      </Box>
    </Container>
  )
}
