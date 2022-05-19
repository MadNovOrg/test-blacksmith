import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Check from '@mui/icons-material/Check'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { StyledAccordion } from './styled'

export type FilterOption = { id: string; title: string; selected: boolean }

type FilterAccordionProps = {
  title: string
  options: FilterOption[]
  onChange: (_: FilterOption[]) => void
  defaultExpanded?: boolean
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  options,
  onChange,
  defaultExpanded,
}) => {
  const handleChange = (item: FilterOption) =>
    onChange(
      options.map(o =>
        o.id === item.id ? { ...o, selected: !item.selected } : o
      )
    )

  return (
    <StyledAccordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ArrowDropDown />} data-testid="filter-by">
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {options.map(o => (
          <ListItemButton
            key={o.id}
            className={o.selected ? 'selected' : ''}
            onClick={() => handleChange(o)}
          >
            <ListItemText primary={o.title} data-testid="filter-item" />
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}
