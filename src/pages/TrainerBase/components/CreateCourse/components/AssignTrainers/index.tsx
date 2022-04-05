import { Typography, Box } from '@mui/material'
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SearchTrainers } from './SearchTrainers'
import { Trainer } from './types'

type State = { lead?: Trainer; assistants?: Trainer[] }

export const AssignTrainers = () => {
  // TODO: get course id from url and load needed infos

  const { t } = useTranslation()

  const [trainers, setTrainers] = useState({} as State)

  const leadValue = useMemo(
    () => (trainers.lead ? [trainers.lead] : []),
    [trainers.lead]
  )

  const assistantsValue = useMemo(
    () => trainers?.assistants ?? [],
    [trainers.assistants]
  )

  const onChangeLead = useCallback((trainers: Trainer[]) => {
    setTrainers(prev => ({ ...prev, lead: trainers[0] }))
  }, [])

  const onChangeAssistants = useCallback((trainers: Trainer[]) => {
    setTrainers(prev => ({ ...prev, assistants: trainers }))
  }, [])

  const notLead = useCallback(
    (matches: Trainer[]) => {
      const ids = new Set(leadValue.map(t => t.id))
      return matches.filter(m => !ids.has(m.id))
    },
    [leadValue]
  )

  const notAssistant = useCallback(
    (matches: Trainer[]) => {
      const ids = new Set(assistantsValue.map(t => t.id))
      return matches.filter(m => !ids.has(m.id))
    },
    [assistantsValue]
  )

  return (
    <Box sx={{ '> * + *': { mt: 5 } }}>
      <Box>
        <Typography variant="subtitle1">
          {t('pages.create-course.assign-trainers.lead-title')}
        </Typography>
        <SearchTrainers
          max={1}
          placeholder={t(
            'pages.create-course.assign-trainers.lead-placeholder'
          )}
          autoFocus={true}
          value={leadValue}
          onChange={onChangeLead}
          matchesFilter={notAssistant}
        />
      </Box>
      <Box>
        <Typography variant="subtitle1">
          {t('pages.create-course.assign-trainers.assistant-title')}
        </Typography>
        <SearchTrainers
          max={3}
          placeholder={t(
            'pages.create-course.assign-trainers.assistant-placeholder'
          )}
          value={assistantsValue}
          onChange={onChangeAssistants}
          matchesFilter={notLead}
        />
      </Box>
    </Box>

    // TODO: Save selected trainers
  )
}
