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
  'data-testid'?: string
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  options,
  onChange,
  defaultExpanded,
  'data-testid': testId = 'FilterAccordion',
}) => {
  const handleChange = (item: FilterOption) =>
    onChange(
      options.map(o =>
        o.id === item.id ? { ...o, selected: !item.selected } : o
      )
    )

  return (
    <StyledAccordion defaultExpanded={defaultExpanded} data-testid={testId}>
      <AccordionSummary expandIcon={<ArrowDropDown />}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {options.map(o => (
          <ListItemButton
            key={o.id}
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
