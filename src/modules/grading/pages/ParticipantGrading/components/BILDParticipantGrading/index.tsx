import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseParticipantQuery } from '@app/generated/graphql'
import { ModuleGroupNote } from '@app/modules/grading/components/ModuleGroupNote/ModuleGroupNote'
import { Strategy } from '@app/types'

type Props = {
  participant: NonNullable<CourseParticipantQuery['participant']>
}

export const BILDParticipantGrading: React.FC<Props> = ({ participant }) => {
  const { t } = useTranslation()

  const strategyModules: Record<string, Strategy & { note?: string }> =
    participant.bildGradingModules?.modules
  return (
    <Stack spacing={0.5}>
      {Object.keys(strategyModules).map(strategyName => {
        const note = strategyModules[strategyName].note

        return (
          <Box key={strategyName}>
            <Accordion
              disableGutters
              data-testid={`strategy-accordion-${strategyName}`}
              defaultExpanded
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Typography fontWeight={600}>
                  {t(`common.bild-strategies.${strategyName}`)}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Stack spacing={1.5}>
                  {strategyModules[strategyName].modules?.length
                    ? strategyModules[strategyName].modules?.map(module => (
                        <Typography key={module.name}>{module.name}</Typography>
                      ))
                    : null}
                </Stack>

                {strategyModules[strategyName].groups?.length
                  ? strategyModules[strategyName].groups?.map(group => (
                      <Box my={1} key={group.name}>
                        <Typography fontWeight="500" mb={1}>
                          {group.name}
                        </Typography>

                        <Stack spacing={1.5} sx={{ pl: 2 }}>
                          {group.modules?.length
                            ? group.modules.map(module => (
                                <Typography key={module.name}>
                                  {module.name}
                                </Typography>
                              ))
                            : null}
                        </Stack>
                      </Box>
                    ))
                  : null}
              </AccordionDetails>
            </Accordion>
            {note ? <ModuleGroupNote note={note} /> : null}
          </Box>
        )
      })}
    </Stack>
  )
}
