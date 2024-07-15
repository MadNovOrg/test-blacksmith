import { Container, Typography, Box, Stack, Skeleton } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterByCurrencies } from '@app/components/filters/FilterByCurrencies'
import { FilterByOrderStatuses } from '@app/components/filters/FilterByOrderStatuses'
import { FilterByPaymentMethods } from '@app/components/filters/FilterByPaymentMethods'
import { FilterSearch } from '@app/components/FilterSearch'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { useOrders, FiltersType } from '@app/modules/orders/hooks/useOrders'

import { List } from '../../components/List'

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
    false,
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
                <FilterByPaymentMethods onChange={onFilterChange} />
                <FilterByCurrencies onChange={onFilterChange} />
                <FilterByOrderStatuses onChange={onFilterChange} />
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
