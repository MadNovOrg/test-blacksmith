import { Checkbox, CheckboxProps, TableCell } from '@mui/material'
import React, { useState, useCallback, useMemo } from 'react'

type ID = string | number
type InputProps = CheckboxProps['inputProps'] & { 'data-testid': string }

/**
 * Utility hook to encapsulate table checkboxes logic
 */
export const useTableChecks = <Entry extends ID>() => {
  const [selected, setSelected] = useState<Set<Entry>>(new Set())

  const _setSelected = useCallback((entries: Entry[], checked = true) => {
    setSelected(prev => {
      if (!entries.length) return new Set()
      const next = new Set(prev)
      entries.forEach(e => (checked ? next.add(e) : next.delete(e)))
      return next
    })
  }, [])

  const isSelected = useCallback(
    (entry: Entry) => selected.has(entry),
    [selected],
  )

  const headCol = useCallback(
    (allEntries: Entry[]) => {
      const count = allEntries.length
      const allChecked = count > 0 && selected.size === count

      return {
        id: 'selection',
        component: (
          <Checkbox
            indeterminate={selected.size > 0 && !allChecked}
            checked={allChecked}
            onChange={({ target }) => {
              _setSelected(target.checked ? allEntries : [], target.checked)
            }}
            inputProps={{ 'data-testid': 'TableChecks-Head' } as InputProps}
          />
        ),
      }
    },
    [_setSelected, selected.size],
  )

  const rowCell = useCallback(
    (entry: Entry, disabled = false) => {
      return (
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected(entry)}
            onChange={({ target }) => _setSelected([entry], target.checked)}
            inputProps={{ 'data-testid': 'TableChecks-Row' } as InputProps}
            disabled={disabled}
          />
        </TableCell>
      )
    },
    [isSelected, _setSelected],
  )

  return useMemo(
    () => ({
      selected,
      setSelected: _setSelected,
      isSelected,
      checkbox: { headCol, rowCell },
    }),
    [selected, _setSelected, headCol, rowCell, isSelected],
  )
}
