import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material'
import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { submodulesCount } from '@app/components/CourseOverview/utils'
import {
  GradedParticipantQuery,
  Course_Participant_Module,
} from '@app/generated/graphql'
import { ModuleGroupNote } from '@app/modules/grading/components/ModuleGroupNote/ModuleGroupNote'
import theme from '@app/theme'
import { transformModulesToGroups } from '@app/util'

type Props = {
  participant: Pick<
    NonNullable<GradedParticipantQuery['participant']>,
    'course' | 'gradingModules' | 'notes'
  >
}

export const ICMGradedOnAccordion: React.FC<Props> = ({ participant }) => {
  const { t } = useTranslation()
  const moduleGroups = useMemo(() => {
    if (participant?.gradingModules) {
      return transformModulesToGroups(
        participant?.gradingModules as unknown as Course_Participant_Module[]
      )
    }

    return []
  }, [participant])

  const moduleGroupNotes: Map<string, string> = useMemo(() => {
    const notes = new Map()

    participant.notes?.forEach(note => {
      notes.set(note.moduleGroupId, note.note)
    })

    return notes
  }, [participant])

  return (
    <Stack spacing={0.5}>
      {moduleGroups.map(group => {
        const groupedModules = groupBy(
          group.modules,
          module => module.completed
        )

        const note = moduleGroupNotes.get(group.id)

        return (
          <Box key={group.id}>
            <Accordion
              defaultExpanded
              disableGutters
              data-testid={`graded-module-group-${group.id}`}
            >
              <AccordionSummary>
                <Typography fontWeight={600}>
                  {group.name}{' '}
                  <Typography variant="body2" component="span">
                    {t('pages.participant-grading.completed-modules-subtitle', {
                      completedNum:
                        submodulesCount(groupedModules['true']) > 0
                          ? submodulesCount(groupedModules['true'])
                          : groupedModules['true']?.length,
                      totalNum:
                        submodulesCount(group.modules) > 0
                          ? submodulesCount(group.modules)
                          : group.modules.length,
                    })}
                  </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {groupedModules['true']?.map(module => (
                    <Box key={module.id}>
                      <Typography key={module.id}>{module.name}</Typography>
                      {module.submodules?.length > 0 &&
                        module.submodules.map(sm => (
                          <Typography key={sm.id} mb={1.5} ml={3} mt={1}>
                            {sm.name}
                          </Typography>
                        ))}
                    </Box>
                  ))}
                </Stack>

                {groupedModules['false']?.length ? (
                  <Box data-testid="incomplete-modules">
                    <Typography
                      fontWeight={600}
                      color={theme.palette.grey[700]}
                      mb={2}
                      ml={-1}
                    >
                      {t('pages.participant-grading.incomplete-list-subtitle')}
                    </Typography>

                    <Stack spacing={2}>
                      {groupedModules['false'].map(module => (
                        <Box key={module.id}>
                          <Typography
                            key={module.id}
                            color={theme.palette.grey[700]}
                          >
                            {module.name}
                          </Typography>
                          {module.submodules?.length > 0 &&
                            module.submodules.map(sm => (
                              <Typography key={sm.id} mb={1.5} ml={3} mt={1}>
                                {sm.name}
                              </Typography>
                            ))}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
              </AccordionDetails>
            </Accordion>
            {note ? <ModuleGroupNote note={note} /> : null}
          </Box>
        )
      })}
    </Stack>
  )
}
