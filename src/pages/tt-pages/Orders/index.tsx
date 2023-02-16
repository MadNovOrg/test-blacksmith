import { Container, Typography, Box, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterCurrencies } from '@app/components/FilterCurrencies'
import { FilterOrderStatuses } from '@app/components/FilterOrderStatuses'
import { FilterPaymentMethods } from '@app/components/FilterPaymentMethods'
import { FilterSearch } from '@app/components/FilterSearch'
import { useOrders, FiltersType } from '@app/hooks/useOrders'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'

import { List } from './List'

export const Orders: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()

  const { Pagination, limit, offset } = useTablePagination()

  const sorting = useTableSort('createdAt', 'asc')

  const [filters, setFilters] = useState<FiltersType>({})

  const { orders, total, isLoading } = useOrders({
    sort: { by: sorting.by, dir: sorting.dir },
    filters,
    limit,
    offset,
  })

  const onFilterChange = useCallback((next: Partial<FiltersType>) => {
    setFilters(prev => ({ ...prev, ...next }))
  }, [])

  const onSearchParamChange = useCallback((newSearchParam: string) => {
    setFilters(prev => ({ ...prev, searchParam: newSearchParam }))
  }, [])

  const loading = isLoading
  const count = orders?.length ?? 0
  const filtered = Object.values(filters).reduce(
    (acc, filter) => acc || filter.length > 0,
    false
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1" data-testid="list-orders-heading">
            {t('common.orders')}
          </Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch
              value={filters.searchParam}
              onChange={onSearchParamChange}
            />

            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>

              <Stack gap={1}>
                <FilterPaymentMethods onChange={onFilterChange} />
                <FilterCurrencies onChange={onFilterChange} />
                <FilterOrderStatuses onChange={onFilterChange} />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
          <List
            orders={orders}
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
