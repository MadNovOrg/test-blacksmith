import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Check from '@mui/icons-material/Check'
import { SxProps } from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { StyledAccordion } from './styled'

export type FilterOption<T = string> = {
  id: T
  title: string
  selected: boolean
}

type FilterAccordionProps<T = string> = {
  title: string
  options: FilterOption<T>[]
  onChange: (options: FilterOption<T>[], selectedItem: FilterOption<T>) => void
  defaultExpanded?: boolean
  'data-testid'?: string
  sx?: SxProps
}

export const FilterAccordion = <T,>({
  title,
  options,
  onChange,
  defaultExpanded,
  'data-testid': testId = 'FilterAccordion',
  sx,
}: FilterAccordionProps<T>) => {
  const handleChange = (item: FilterOption<T>) =>
    onChange(
      options.map(o =>
        o.id === item.id ? { ...o, selected: !item.selected } : o
      ),
      item
    )

  const shouldExpand =
    Object.values(options).some(val => val.selected === true) || defaultExpanded

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
        {options.map(o => (
          <ListItemButton
            key={String(o.id)}
            className={o.selected ? 'selected' : ''}
            onClick={() => handleChange(o)}
            data-testid={`${testId}-option`}
            data-id={o.id}
          >
            <ListItemText primary={o.title} />
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}
