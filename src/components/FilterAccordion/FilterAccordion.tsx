import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Check from '@mui/icons-material/Check'
import { SxProps } from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, { useMemo } from 'react'

import theme from '@app/theme'

import { StyledAccordion } from './styled'

export type FilterOption<T = string> = {
  id: T
  title: string
  selected: boolean
  highlight?: boolean
}

type FilterAccordionProps<T = string> = {
  title: string
  options: FilterOption<T>[]
  onChange: (options: FilterOption<T>[], selectedItem: FilterOption<T>) => void
  defaultExpanded?: boolean
  'data-testid'?: string
  sx?: SxProps
  sort?: boolean
}

export const FilterAccordion = <T,>({
  title,
  options,
  onChange,
  defaultExpanded,
  'data-testid': testId = 'FilterAccordion',
  sx,
  sort = true,
}: FilterAccordionProps<T>) => {
  const handleChange = (item: FilterOption<T>) =>
    onChange(
      options.map(o =>
        o.id === item.id ? { ...o, selected: !item.selected } : o,
      ),
      item,
    )

  // When options change, shouldExpand changes between true <-> false, and MUI doesn’t like
  // when defaultExpanded prop changes after mount.
  // useMemo is used here just to preserve the original/first value. Not for performance.
  const shouldExpand = useMemo(
    () =>
      Object.values(options).some(val => val.selected === true) ||
      defaultExpanded,
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <StyledAccordion
      defaultExpanded={shouldExpand}
      data-testid={testId}
      sx={sx}
    >
      <AccordionSummary expandIcon={<ArrowDropDown />}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {(sort
          ? [...options].sort((a, b) => a.title.localeCompare(b.title))
          : options
        ).map(o => (
          <ListItemButton
            key={String(o.id)}
            className={o.selected ? 'selected' : ''}
            onClick={() => handleChange(o)}
            data-testid={`${testId}-option-${o.id}`}
            data-id={o.id}
          >
            <ListItemText
              primary={o.title}
              sx={o.highlight ? { color: theme.palette.error.dark } : {}}
            />
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}
