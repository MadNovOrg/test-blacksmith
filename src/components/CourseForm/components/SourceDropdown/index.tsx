import {
  MenuItem,
  Select,
  FormControl,
  SelectProps,
  InputLabel,
} from '@mui/material'
import React from 'react'

import { Course_Source_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const SourceDropdown = React.forwardRef(function SourceDropdown(
  props: SelectProps<Course_Source_Enum | ''>,
  ref: React.Ref<HTMLSelectElement>
) {
  const { t, _t } = useScopedTranslation('components.course-source-dropdown')
  const options = Object.values(Course_Source_Enum)

  return (
    <FormControl fullWidth variant="filled">
      <InputLabel id="course-source-dropdown">{t('placeholder')}</InputLabel>
      <Select {...props} id="course-source-dropdown" ref={ref}>
        {options.map(option => (
          <MenuItem
            key={option}
            value={option}
            data-testid={`source-option-${option}`}
          >
            {_t(`course-sources.${option}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})
