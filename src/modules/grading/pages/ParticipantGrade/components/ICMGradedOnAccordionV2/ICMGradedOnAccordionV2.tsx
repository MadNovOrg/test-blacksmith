import {
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ModuleGroupNote } from '@app/modules/grading/components/ModuleGroupNote/ModuleGroupNote'
import {
  countLessons,
  isLesson,
  isModule,
} from '@app/modules/grading/shared/utils'
import theme from '@app/theme'

export const ICMGradedOnAccordionV2: React.FC<{ gradedOn: unknown }> = ({
  gradedOn,
}) => {
  const { t } = useTranslation()

  return Array.isArray(gradedOn) && gradedOn.length ? (
    <Stack spacing={0.5}>
      {gradedOn.map(module => {
        if (!isModule(module)) {
          return null
        }

        const lessons = module.lessons?.items

        const { numberOfLessons, coveredLessons: numberOfCoveredLessons } =
          countLessons(lessons)

        const coveredLessons = Array.isArray(lessons)
          ? lessons.filter((l: object) => {
              if (!isLesson(l)) {
                return false
              }

              return l.covered
            })
          : []

        const notCoveredLessons = Array.isArray(lessons)
          ? lessons.filter((l: object) => {
              if (!isLesson(l)) {
                return false
              }

              return !l.covered
            })
          : []

        return (
          <Box key={module.id}>
            <Accordion
              defaultExpanded
              disableGutters
              data-testid={`graded-module-group-${module.id}`}
            >
              <AccordionSummary>
                <Typography fontWeight={600}>
                  {module.displayName ?? module.name}{' '}
                  <Typography variant="body2" component="span">
                    {t('pages.participant-grading.completed-modules-subtitle', {
                      completedNum: numberOfCoveredLessons,
                      totalNum: numberOfLessons,
                    })}
                  </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {coveredLessons.length
                    ? coveredLessons.map((lesson: object, index) => {
                        if (!isLesson(lesson)) {
                          return null
                        }

                        const childLessons = lesson.items
                        const hasChildren =
                          Array.isArray(childLessons) && childLessons.length

                        return (
                          <Box key={index}>
                            <Typography
                              fontWeight={hasChildren ? 600 : 400}
                              mb={hasChildren ? 1 : 0}
                            >
                              {lesson?.name}
                            </Typography>

                            {hasChildren ? (
                              <Stack ml={2} spacing={1}>
                                {childLessons.map((item, index) => (
                                  <Typography key={index}>
                                    {item?.name}
                                  </Typography>
                                ))}
                              </Stack>
                            ) : null}
                          </Box>
                        )
                      })
                    : null}
                </Stack>

                {notCoveredLessons.length ? (
                  <Box data-testid="incomplete-modules" mt={4}>
                    <Typography
                      fontWeight={600}
                      color={theme.palette.grey[700]}
                      mb={2}
                    >
                      {t('pages.participant-grading.incomplete-list-subtitle')}
                    </Typography>

                    <Stack spacing={2}>
                      {notCoveredLessons.length
                        ? notCoveredLessons.map((lesson: object, index) => {
                            if (!isLesson(lesson)) {
                              return null
                            }

                            const childLessons = lesson.items
                            const hasChildren =
                              Array.isArray(childLessons) && childLessons.length

                            return (
                              <Box key={index}>
                                <Typography
                                  fontWeight={hasChildren ? 600 : 400}
                                  mb={hasChildren ? 1 : 0}
                                >
                                  {lesson?.name}
                                </Typography>

                                {hasChildren ? (
                                  <Stack ml={2} spacing={1}>
                                    {childLessons.map((item, index) => (
                                      <Typography key={index}>
                                        {item?.name}
                                      </Typography>
                                    ))}
                                  </Stack>
                                ) : null}
                              </Box>
                            )
                          })
                        : null}
                    </Stack>
                  </Box>
                ) : null}
              </AccordionDetails>
            </Accordion>
            {module.note ? <ModuleGroupNote note={module.note} /> : null}
          </Box>
        )
      })}
    </Stack>
  ) : null
}
