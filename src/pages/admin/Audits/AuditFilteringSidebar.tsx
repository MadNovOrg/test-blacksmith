import { Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterDates } from '@app/components/FilterDates'
import { FilterSearch } from '@app/components/FilterSearch'

export type FilterChangeEvent =
  | {
      source: 'search'
      value: string
    }
  | {
      source: 'dates'
      value: [Date | undefined, Date | undefined]
    }

export type AuditFilteringSidebarProps = {
  count: number
  onChange: (e: FilterChangeEvent) => void
}

export const AuditFilteringSidebar: React.FC<AuditFilteringSidebarProps> = ({
  count,
  onChange,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  return (
    <Box display="flex" gap={4}>
      <Box width={250}>
        <Typography variant="body2" color="grey.500" mt={1}>
          {t('common.x-items', { count })}
        </Typography>

        <Stack gap={4} mt={4}>
          <FilterSearch
            value={query}
            onChange={value => {
              setQuery(value)
              onChange({ source: 'search', value })
            }}
          />

          <Box>
            <Stack gap={1}>
              <FilterDates
                onChange={(from, to) =>
                  onChange({ source: 'dates', value: [from, to] })
                }
                title={t('filters.date-range')}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
