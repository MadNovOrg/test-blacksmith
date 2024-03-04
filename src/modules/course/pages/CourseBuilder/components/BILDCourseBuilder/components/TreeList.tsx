import CollapsedIcon from '@mui/icons-material/AddBox'
import ExpandedIcon from '@mui/icons-material/IndeterminateCheckBox'
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'

import { BILDModuleGroup } from '@app/types'

type TreeListProps = {
  parentName: string
  group: BILDModuleGroup
  state: Record<string, boolean>
  onChange: (state: Record<string, boolean>) => void
  disabled: boolean
  showDuration?: boolean
}

export const TreeList: React.FC<React.PropsWithChildren<TreeListProps>> = ({
  parentName,
  group,
  state,
  onChange,
  disabled,
  showDuration = true,
}) => {
  const [open, setOpen] = useState(false)
  const name = `${parentName}.${group.name}`

  const allSelected = useMemo(
    () => group.modules.every(m => state[`${name}.${m.name}`] ?? false),
    [state, group, name]
  )

  const someSelected = useMemo(
    () =>
      !allSelected &&
      group.modules.some(m => state[`${name}.${m.name}`] ?? false),
    [state, group, name, allSelected]
  )

  useEffect(() => {
    if (!someSelected) return

    const mandatoryPendingItems = group.modules.filter(item => {
      return item.mandatory && !state[`${name}.${item.name}`]
    })

    if (!mandatoryPendingItems.length) return

    onChange({
      ...state,
      ...mandatoryPendingItems.reduce((acc, item) => {
        acc[`${name}.${item.name}`] = true
        return acc
      }, {} as Record<string, boolean>),
    })
  }, [someSelected, group, name, state]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box display="flex" alignItems="center" ml={-1.4}>
        {open ? (
          <IconButton
            onClick={() => setOpen(false)}
            color="primary"
            size="small"
            sx={{ '&&': { p: 0.5, ml: 1 } }}
            data-testid={`collapse-button-${group.name}`}
          >
            <ExpandedIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => setOpen(true)}
            color="primary"
            size="small"
            sx={{ '&&': { p: 0.5, ml: 1 } }}
            data-testid={`expand-button-${group.name}`}
          >
            <CollapsedIcon />
          </IconButton>
        )}
        <Box
          sx={{
            borderTopWidth: 1,
            borderStyle: 'solid',
            borderColor: 'primary.main',
            ml: -1,
            mr: -1,
            width: 17,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              disabled={disabled}
              indeterminate={someSelected}
              onChange={(_, checked) => {
                onChange({
                  ...state,
                  [name]: checked,
                  ...group.modules.reduce((acc, m) => {
                    acc[`${name}.${m.name}`] = checked
                    return acc
                  }, {} as Record<string, boolean>),
                })
              }}
              sx={{ '&&': { p: 0.5, ml: 1.5 } }}
            />
          }
          label={
            <Typography>
              {group.name}
              {group.duration && showDuration && (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ ml: 1, display: 'inline' }}
                >
                  {group.duration} mins
                </Typography>
              )}
            </Typography>
          }
          sx={{ width: '100%' }}
        />
      </Box>
      {open && (
        <Box sx={{ ml: 4 }}>
          {group.modules.map(m => (
            <FormControlLabel
              data-testid={`module-${name}.${m.name}`}
              key={m.name}
              control={
                <Checkbox
                  checked={state[`${name}.${m.name}`] ?? false}
                  disabled={disabled || !!group.duration}
                  indeterminate={false}
                  onChange={(_, checked) => {
                    onChange({ ...state, [`${name}.${m.name}`]: checked })
                  }}
                />
              }
              label={
                <Typography>
                  {m.name}
                  {m.mandatory && !disabled && <span> *</span>}
                  {showDuration && m.duration && (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, display: 'inline' }}
                    >
                      {m.duration} mins
                    </Typography>
                  )}
                </Typography>
              }
              sx={{ width: '100%' }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
