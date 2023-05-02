import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material'
import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CourseParticipantQuery,
  Course_Participant_Module,
} from '@app/generated/graphql'
import theme from '@app/theme'
import { transformModulesToGroups } from '@app/util'

type Props = {
  participant: NonNullable<CourseParticipantQuery['participant']>
}

export const ICMParticipantGrading: React.FC<Props> = ({ participant }) => {
  const { t } = useTranslation()
  const moduleGroups = useMemo(() => {
    if (participant?.gradingModules) {
      return transformModulesToGroups(
        participant?.gradingModules as unknown as Course_Participant_Module[]
      )
    }

    return []
  }, [participant])

  return (
    <>
      {moduleGroups.map(group => {
        const groupedModules = groupBy(
          group.modules,
          module => module.completed
        )

        return (
          <Accordion
            key={group.id}
            defaultExpanded
            disableGutters
            sx={{ marginBottom: 0.5 }}
            data-testid={`graded-module-group-${group.id}`}
          >
            <AccordionSummary>
              <Typography fontWeight={600}>
                {group.name}{' '}
                <Typography variant="body2" component="span">
                  {t('pages.participant-grading.completed-modules-subtitle', {
                    completedNum: groupedModules['true']?.length,
                    totalNum: group.modules.length,
                  })}
                </Typography>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {groupedModules['true']?.map(module => (
                <Typography key={module.id} mb={2}>
                  {module.name}
                </Typography>
              ))}

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

                  {groupedModules['false'].map(module => (
                    <Typography
                      key={module.id}
                      mb={2}
                      color={theme.palette.grey[700]}
                    >
                      {module.name}
                    </Typography>
                  ))}
                </Box>
              ) : null}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}
