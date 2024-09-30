import { IconButton, MenuItem, TextField } from '@mui/material'
import { ClearIcon } from '@mui/x-date-pickers'
import React, { useCallback } from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

interface IAttendeeOrganizationDropdownProps {
  options: string[]
  selectedOrganization: string
  onChange: (value: string) => void
}

export const AttendeeOrganizationDropdown = React.forwardRef(
  function AttendeeOrganizationDropdown(
    props: IAttendeeOrganizationDropdownProps,
  ) {
    const { t } = useScopedTranslation('components.organization-dropdown')

    const { options, selectedOrganization, onChange } = props
    const handleClear = useCallback(() => onChange(''), [onChange])
    return (
      <TextField
        sx={{ bgcolor: 'grey.100' }}
        select
        fullWidth
        variant="filled"
        label={t('title')}
        data-testid="attendee-organization-dropdown"
        value={selectedOrganization}
        onChange={e => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton
              size="small"
              onClick={handleClear}
              data-testid="FilterSearch-Clear"
              sx={{ marginRight: '15px' }}
            >
              <ClearIcon sx={{ fontSize: '1em' }} />
            </IconButton>
          ),
        }}
      >
        {options?.length
          ? options.map(option => (
              <MenuItem
                key={option}
                value={option}
                data-testid={`organization-option-${option}`}
              >
                {option}
              </MenuItem>
            ))
          : null}
      </TextField>
    )
  },
)
