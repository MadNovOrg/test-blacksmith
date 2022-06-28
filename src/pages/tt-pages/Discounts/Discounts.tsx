import { Box, Button, Container, Stack, Typography } from '@mui/material'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { useTableSort } from '@app/hooks/useTableSort'

import { Filters } from './Filters'
import { List } from './List'

type Filters = { from?: Date; to?: Date }

export const Discounts: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const sorting = useTableSort('createdAt', 'asc')

  const [filters, setFilters] = useState<Filters>({})

  const { promoCodes, isLoading } = usePromoCodes({
    sort: { by: sorting.by, dir: sorting.dir },
    filters,
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
          <Typography variant="h1">{t('promoCodes')}</Typography>
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
            <Box></Box>
            <Button variant="contained" onClick={() => navigate('./new')}>
              {t('pages.promoCodes.new-btn')}
            </Button>
          </Box>
          <List
            promoCodes={promoCodes}
            sorting={sorting}
            loading={isLoading}
            filtered={filtered}
          />
        </Box>
      </Box>
    </Container>
  )
}
