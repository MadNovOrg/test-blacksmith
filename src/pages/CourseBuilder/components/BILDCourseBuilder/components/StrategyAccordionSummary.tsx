import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BILDModule } from '@app/types'

import { hasKeyStartingWith } from '../helpers'

import { TreeListSummary } from './TreeListSummary'

type StrategyAccordionSummaryProps = {
  name: string
  modules: {
    modules?: Array<BILDModule>
    groups?: Array<{ name: string; modules: Array<BILDModule> }>
  }
  state: Record<string, boolean>
}

export const StrategyAccordionSummary: React.FC<
  React.PropsWithChildren<StrategyAccordionSummaryProps>
> = ({ name, modules, state }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Accordion
      expanded={open}
      onChange={() => setOpen(!open)}
      sx={{ mb: 3, py: 0, width: '100%' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        sx={{
          py: 0,
          backgroundColor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: open ? 0 : 8,
          borderBottomRightRadius: open ? 0 : 8,
        }}
      >
        <Box display="flex" alignItems="center">
          <CheckedAllIcon color="inherit" />

          <Typography sx={{ ml: 1 }}>
            {t(`common.bild-strategies.${name}`)}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'primary.main',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          borderTopWidth: 0,
        }}
      >
        {modules.modules?.map(m =>
          state[`${name}.${m.name}`] ? (
            <FormControlLabel
              key={m.name}
              control={<Checkbox checked />}
              label={<Typography>{m.name}</Typography>}
              sx={{ width: '100%' }}
            />
          ) : null
        )}

        <Box sx={{ mt: 2 }}>
          {modules.groups?.map((g, index) =>
            hasKeyStartingWith(state, `${name}.${g.name}`) ? (
              <TreeListSummary
                key={index}
                parentName={name}
                group={g}
                state={state}
              />
            ) : null
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
