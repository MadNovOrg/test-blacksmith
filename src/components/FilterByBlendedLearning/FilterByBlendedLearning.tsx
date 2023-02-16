import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { grey } from '@mui/material/colors'
import FormControlLabel from '@mui/material/FormControlLabel'
import { formControlLabelClasses } from '@mui/material/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { noop } from '@app/util'

type Props = {
  selected: boolean
  onChange: (selected: boolean) => void
}

export const FilterByBlendedLearning: React.FC<
  React.PropsWithChildren<Props>
> = ({ selected = false, onChange = noop }) => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${grey['400']}`,
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={selected}
            onChange={(event, checked) => onChange(checked)}
          />
        }
        label={t('common.blended-learning')}
        sx={{
          [`& .${formControlLabelClasses.label}`]: {
            fontSize: '.95rem',
            color: grey['800'],
          },
        }}
      />
    </Box>
  )
}
