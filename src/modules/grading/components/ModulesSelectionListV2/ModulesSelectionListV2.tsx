import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { noop } from 'ts-essentials'

import { Module_V2 } from '@app/generated/graphql'
import {
  countLessons,
  isLesson,
  isModule,
} from '@app/modules/grading/shared/utils'
import { Lesson } from '@app/modules/grading/utils/types'
import theme from '@app/theme'

type Props = {
  curriculum: unknown
  onChange?: (curriculum: unknown) => void
  slots?: {
    afterModule: (moduleId: string) => React.ReactNode
  }
}

export const ModulesSelectionListV2: React.FC<Props> = ({
  curriculum,
  onChange = noop,
  slots,
}) => {
  const [curriculumMap, setCurriculumMap] = useState<Map<string, Module_V2>>(
    () => {
      const curriculumMap = new Map<string, Module_V2>()

      if (Array.isArray(curriculum) && curriculum.length) {
        curriculum.forEach(module => {
          if (isModule(module)) {
            const lessons = module?.lessons?.items

            if (!Array.isArray(lessons)) {
              return
            }

            lessons.forEach(l => {
              if (isLesson(l)) {
                l.covered = Boolean(module.mandatory || l.covered)

                l.items?.forEach(childLesson => {
                  if (isLesson(childLesson)) {
                    childLesson.covered = Boolean(module.mandatory || l.covered)
                  }
                })
              }
            })

            curriculumMap.set(module.id, module)
          }
        })
      }

      return curriculumMap
    },
  )

  useEffect(() => {
    onChange(Array.from(curriculumMap.values()))
  }, [curriculumMap, onChange])

  const toggleModule = (id: string) => {
    const module = curriculumMap.get(id)

    if (!module) {
      return
    }

    const lessons = module?.lessons?.items

    if (!Array.isArray(lessons)) {
      return
    }

    const toggledOn = allLessonsChecked(lessons)

    lessons.forEach(l => {
      if (isLesson(l)) {
        l.covered = !toggledOn

        l.items?.forEach(childLesson => {
          if (isLesson(childLesson)) {
            childLesson.covered = !toggledOn
          }
        })
      }
    })

    const newCurriculumMap = new Map(curriculumMap)

    newCurriculumMap.set(id, module)

    setCurriculumMap(newCurriculumMap)
  }

  const toggleLesson = ({
    moduleId,
    lessonName,
  }: {
    moduleId: string
    lessonName: string
  }) => {
    const module = curriculumMap.get(moduleId)

    if (!module) {
      return
    }

    const lessons = module.lessons?.items?.flatMap((lesson: object) => {
      if (isLesson(lesson)) {
        return [lesson, ...(lesson.items?.length ? [...lesson.items] : [])]
      }
    })

    const lesson = lessons.find((l: object) => {
      if (!isLesson(l)) {
        return false
      }

      return l.name === lessonName
    })

    if (!isLesson(lesson)) {
      return
    }

    lesson.covered = !lesson.covered

    lesson.items?.forEach(childLesson => {
      if (isLesson(childLesson)) {
        childLesson.covered = lesson.covered
      }
    })

    const newCurriculumMap = new Map(curriculumMap)

    newCurriculumMap.set(moduleId, module)

    setCurriculumMap(newCurriculumMap)
  }

  return (
    <Stack spacing={1}>
      {Array.isArray(curriculum) && curriculum.length
        ? curriculum.map(module => {
            if (!isModule(module)) {
              return null
            }

            const lessons = module.lessons?.items

            const { numberOfLessons, coveredLessons } = countLessons(lessons)
            const moduleIsChecked =
              coveredLessons > 0 && numberOfLessons === coveredLessons
            const moduleIsIndeterminate =
              coveredLessons > 0 && numberOfLessons > coveredLessons

            return (
              <Box key={module.id}>
                <Accordion
                  disableGutters
                  data-testid={`module-group-${module.id}`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`accordion-module-group-${module.id}-content`}
                    id={`accordion-module-group-${module.id}-header`}
                    sx={{ display: 'flex', alignItems: 'center' }}
                    data-testid={`accordion-summary`}
                  >
                    <FormGroup key={module.id}>
                      <FormControlLabel
                        onClick={e => e.stopPropagation()}
                        control={
                          <Checkbox
                            checked={moduleIsChecked}
                            indeterminate={moduleIsIndeterminate}
                            onChange={() => {
                              toggleModule(module.id)
                            }}
                            disabled={Boolean(module.mandatory)}
                          />
                        }
                        label={
                          <Typography
                            component="span"
                            color={
                              moduleIsChecked
                                ? theme.palette.text.primary
                                : theme.palette.text.secondary
                            }
                            fontWeight={600}
                          >
                            {module.displayName ?? module.name}
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </AccordionSummary>

                  <AccordionDetails sx={{ paddingLeft: 4 }}>
                    {module.lessons.items?.map((lesson: object) => {
                      if (!isLesson(lesson)) {
                        return null
                      }

                      const isLessonGroup = Boolean(
                        Array.isArray(lesson.items) && lesson.items?.length,
                      )

                      const { numberOfLessons, coveredLessons } = isLessonGroup
                        ? countLessons(lesson.items ?? [])
                        : { numberOfLessons: 0, coveredLessons: 0 }

                      const lessonGroupIndeterminate =
                        coveredLessons > 0 && coveredLessons < numberOfLessons

                      return (
                        <FormGroup key={lesson.name} sx={{ marginBottom: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  toggleLesson({
                                    moduleId: module.id,
                                    lessonName: lesson.name,
                                  })
                                }
                                onClick={e => e.stopPropagation()}
                                checked={lesson.covered ?? false}
                                indeterminate={lessonGroupIndeterminate}
                                disabled={Boolean(module.mandatory)}
                              />
                            }
                            label={
                              <Typography
                                color={
                                  lesson.covered
                                    ? theme.palette.text.primary
                                    : theme.palette.text.secondary
                                }
                              >
                                {lesson.name}
                              </Typography>
                            }
                          />
                          {lesson?.items?.length
                            ? lesson.items.map(childLesson => {
                                return (
                                  <FormControlLabel
                                    key={childLesson.name}
                                    control={
                                      <Checkbox
                                        onChange={() => {
                                          toggleLesson({
                                            moduleId: module.id,
                                            lessonName: childLesson.name,
                                          })
                                        }}
                                        onClick={e => e.stopPropagation()}
                                        checked={childLesson.covered ?? false}
                                        sx={{ ml: 3 }}
                                        disabled={Boolean(module.mandatory)}
                                      />
                                    }
                                    label={
                                      <Typography
                                        key={childLesson.name}
                                        mb={1.5}
                                        ml={1}
                                        mt={1}
                                      >
                                        {childLesson.name}
                                      </Typography>
                                    }
                                  />
                                )
                              })
                            : null}
                        </FormGroup>
                      )
                    })}
                  </AccordionDetails>
                </Accordion>

                {typeof slots?.afterModule === 'function'
                  ? slots.afterModule(module.id)
                  : null}
              </Box>
            )
          })
        : null}
    </Stack>
  )
}

function allLessonsChecked(lessons: Lesson[]): boolean {
  if (!Array.isArray(lessons) || !lessons.length) {
    return true
  }

  const { numberOfLessons, coveredLessons } = countLessons(lessons)

  return coveredLessons > 0 && numberOfLessons === coveredLessons
}
