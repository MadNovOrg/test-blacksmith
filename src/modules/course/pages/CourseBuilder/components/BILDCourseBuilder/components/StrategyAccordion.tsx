import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckedSomeIcon from '@mui/icons-material/RemoveCircle'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BILDModule, BILDModuleGroup } from '@app/types'

import { TreeList } from './TreeList'

type StrategyAccordionProps = {
  id: string
  expanded: boolean
  onToggle: (panel: string | false) => void
  name: string
  duration?: number | null
  modules: {
    modules?: Array<BILDModule>
    groups?: Array<BILDModuleGroup>
  }
  state: Record<string, boolean>
  onChange: (state: Record<string, boolean>) => void
  disabled: boolean
  showAsterisk: boolean
}

export const StrategyAccordion: React.FC<
  React.PropsWithChildren<StrategyAccordionProps>
> = ({
  id,
  expanded,
  onToggle,
  duration,
  name,
  modules,
  state,
  onChange,
  disabled,
  showAsterisk,
}) => {
  const { t } = useTranslation()
  const handleToggle = (event: React.SyntheticEvent, isExpanded: boolean) => {
    onToggle(isExpanded ? id : false)
  }

  const { allSelected, someSelected } = useMemo(() => {
    const arr =
      modules.groups?.flatMap(g =>
        g.modules.map(m => `${name}.${g.name}.${m.name}`)
      ) ?? []

    const keys = (modules.modules?.map(m => `${name}.${m.name}`) ?? []).concat(
      arr
    )

    const allSelected = keys.every(k => state[k])
    const someSelected = !allSelected && keys.some(k => state[k])

    return { allSelected, someSelected }
  }, [modules, state, name])

  return (
    <Accordion
      expanded={expanded}
      onChange={handleToggle}
      sx={{ mb: 3, py: 0, width: '100%' }}
      TransitionProps={{ timeout: 0 }}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        sx={{
          py: 0,
          backgroundColor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: expanded ? 0 : 8,
          borderBottomRightRadius: expanded ? 0 : 8,
          opacity: disabled ? 0.6 : 1,
        }}
        data-testid={`strategy-${name}`}
      >
        <Box display="flex" alignItems="center">
          {someSelected ? (
            <CheckedSomeIcon color="inherit" />
          ) : allSelected ? (
            <CheckedAllIcon color="inherit" />
          ) : (
            <UncheckedIcon color="inherit" />
          )}

          <Box>
            <Typography sx={{ ml: 1 }}>
              <span>{t(`common.bild-strategies.${name}`)}</span>
              {showAsterisk ? <span> *</span> : null}
            </Typography>
            {duration && (
              <Typography variant="body2" color="white" sx={{ ml: 1 }}>
                {t('common.minimumXHours', { hours: duration / 60 })}
              </Typography>
            )}
          </Box>
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
        {modules.modules?.map(m => (
          <FormControlLabel
            key={m.name}
            control={
              <Checkbox
                checked={state[`${name}.${m.name}`] || false}
                disabled={disabled}
                indeterminate={false}
                onChange={(_, checked) => {
                  onChange({ ...state, [`${name}.${m.name}`]: checked })
                }}
              />
            }
            label={<Typography>{m.name}</Typography>}
            sx={{ width: '100%' }}
          />
        ))}

        <Box sx={{ mt: 2 }}>
          {modules.groups?.map((g, index) => (
            <TreeList
              key={index}
              parentName={name}
              group={g}
              state={state}
              onChange={onChange}
              disabled={disabled}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
