import {
  Box,
  FormControlLabel,
  Checkbox,
  formControlLabelClasses,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { noop } from '@app/util'

type Props = {
  selected: boolean
  onChange: (selected: boolean) => void
}

export const FilterByReaccreditation: React.FC<Props> = ({
  selected = false,
  onChange = noop,
}) => {
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
        label={t('common.reaccreditation')}
        data-testid="FilterByReaccreditation"
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
