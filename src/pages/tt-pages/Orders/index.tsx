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

  return (
    <Container maxWidth="lg" sx={{ pt: 6 }}>
      <Stack direction="row" gap={4}>
        <Box width={260}>
          <Typography variant="h1" mb={4}>
            {t('common.orders')}
          </Typography>
          <Filters onChange={onFilterChange} />
        </Box>
        <Box flex={1}>
          <List orders={orders} sorting={sorting} loading={isLoading} />
        </Box>
      </Stack>
    </Container>
  )
}
