import { Container, Typography, Box, Stack, Skeleton } from '@mui/material'
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

  const filtered = Object.values(filters).reduce(
    (acc, filter) => acc || filter.length > 0,
    false
  )

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1" data-testid="list-orders-heading" mb={2}>
            {t('common.orders')}
          </Typography>
          <Typography variant="body2">
            {isLoading && !orders ? (
              <Skeleton width={40} />
            ) : (
              t('x-items', { count: total })
            )}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch
              value={filters.searchParam}
              onChange={onSearchParamChange}
            />

            <Box>
              <Stack gap={4}>
                <FilterPaymentMethods onChange={onFilterChange} />
                <FilterCurrencies onChange={onFilterChange} />
                <FilterOrderStatuses onChange={onFilterChange} />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
          <List
            orders={orders ?? []}
            sorting={sorting}
            loading={isLoading}
            filtered={filtered}
          />
          {total ? <Pagination total={total} /> : null}
        </Box>
      </Box>
    </Container>
  )
}
