import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IconButton } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React from 'react'

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
    <Accordion elevation={0} defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} data-testid="filter-by">
        <Typography variant="body2">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {options.map(o => (
          <ListItemButton
            key={o.id}
            sx={{ py: 0, pr: 0, minHeight: 40 }}
            onClick={() => handleChange(o)}
          >
            <ListItemText
              primary={o.title}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: o.selected ? '600' : undefined,
              }}
              data-testid="filter-item"
            />
            <ListItemIcon sx={{ color: 'inherit', justifyContent: 'flex-end' }}>
              {o.selected && (
                <IconButton size="small">
                  <CloseIcon />
                </IconButton>
              )}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
