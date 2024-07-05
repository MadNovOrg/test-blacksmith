import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { BILDModuleGroup } from '@app/types'

type TreeListSummaryProps = {
  parentName: string
  group: BILDModuleGroup
  state: Record<string, boolean>
}

export const TreeListSummary: React.FC<
  React.PropsWithChildren<TreeListSummaryProps>
> = ({ parentName, group, state }) => {
  const { t } = useTranslation()
  const name = `${parentName}.${group.name}`

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <FormControlLabel
          control={<Checkbox checked />}
          label={<Typography>{group.name || t('common.group')}</Typography>}
          sx={{ width: '100%' }}
        />
      </Box>
      <Box sx={{ ml: 4 }}>
        {group.modules.map(m =>
          state[`${name}.${m.name}`] ? (
            <FormControlLabel
              key={m.name}
              control={<Checkbox checked />}
              label={<Typography>{m.name}</Typography>}
              sx={{ width: '100%' }}
            />
          ) : null,
        )}
      </Box>
    </Box>
  )
}
