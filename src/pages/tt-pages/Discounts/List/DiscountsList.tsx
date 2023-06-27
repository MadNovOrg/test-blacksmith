import { Box, Button, Container, Stack, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'

import { FullHeightPage } from '../../../../components/FullHeightPage'
import theme from '../../../../theme'

import { Filters } from './Filters'
import { PendingApproval } from './PendingApproval'
import { DiscountsTable } from './Table'

type Filters = {
  from?: Date
  to?: Date
  type?: string[]
  code?: string
  status?: string[]
}

export const DiscountsList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { acl } = useAuth()

  const { Pagination, limit, offset } = useTablePagination()
  const sorting = useTableSort('createdAt', 'asc')
  const [filters, setFilters] = useState<Filters>({})

  const { promoCodes, total, isLoading, mutate } = usePromoCodes({
    sort: { by: sorting.by, dir: sorting.dir },
    filters,
    limit,
    offset,
  })

  const onFilterChange = useCallback((next: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...next }))
  }, [])

  const loading = isLoading
  const filtered =
    !!filters.from ||
    !!filters.to ||
    !!filters.type?.length ||
    !!filters.code ||
    !!filters.status?.length
  const count = promoCodes.length ?? 0

  return (
    <FullHeightPage>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton label={t('pages.admin.back-to-settings')} />

          <Typography variant="h1" py={2} fontWeight={600}>
            {t('pages.promoCodes.title')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5, position: 'relative' }}>
        <SnackbarMessage
          messageKey="discount-disabled"
          sx={{ position: 'absolute' }}
        />

        <Box display="flex" gap={4}>
          <Box width={250}>
            <Typography variant="body2" color="grey.600" mt={1}>
              {loading ? <>&nbsp;</> : t('x-items', { count })}
            </Typography>

            <Stack gap={4} mt={4}>
              <Filters onChange={onFilterChange} />
            </Stack>
          </Box>

          <Box flex={1}>
            <Box
              display="flex"
              alignItems="flex-end"
              flexDirection="column"
              mb={2}
            >
              <Button variant="contained" onClick={() => navigate('./new')}>
                {t('pages.promoCodes.new-btn')}
              </Button>
            </Box>

            {acl.canApproveDiscount() ? (
              <>
                <Box>
                  <Typography fontWeight="bold">
                    {t('pages.promoCodes.list-title-pending')}
                  </Typography>
                </Box>
                <PendingApproval onAction={mutate} />
              </>
            ) : null}

            <DiscountsTable
              promoCodes={promoCodes}
              sorting={sorting}
              loading={isLoading}
              filtered={filtered}
              onAction={mutate}
            />

            <Pagination total={total} />
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
