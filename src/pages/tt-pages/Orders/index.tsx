import { Container, Typography, Box, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useOrders } from '@app/hooks/useOrders'
import { useTableSort } from '@app/hooks/useTableSort'

import { Filters } from './Filters'
import { List } from './List'

type Filters = { from?: Date; to?: Date }

export const Orders: React.FC = () => {
  const { t } = useTranslation()

  const sorting = useTableSort('createdAt', 'asc')

  const [filters, setFilters] = useState<Filters>({})

  const { orders, isLoading } = useOrders({
    sort: { by: sorting.by, dir: sorting.dir },
    filters,
  })

  const onFilterChange = useCallback((next: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...next }))
  }, [])

  const loading = isLoading
  const count = orders.length ?? 0

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('common.orders')}</Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <Filters onChange={onFilterChange} />
          </Stack>
        </Box>

        <Box flex={1}>
          <List orders={orders} sorting={sorting} loading={isLoading} />
        </Box>
      </Box>
    </Container>
  )
}
