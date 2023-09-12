import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  Container,
} from '@mui/material'
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { useSnackbar } from '@app/context/snackbar'
import {
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
  SaveCourseModulesBildMutation,
  SaveCourseModulesBildMutationVariables,
} from '@app/generated/graphql'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { NotFound } from '@app/pages/common/NotFound'
import { MUTATION as SAVE_COURSE_MODULES_BILD_MUTATION } from '@app/queries/courses/save-course-modules-bild'
import { CourseLevel, Strategy } from '@app/types'
import {
  LoadingStatus,
  formatDurationShort,
  getSWRLoadingStatus,
} from '@app/util'

import { Hero } from '../Hero/Hero'
import { COURSE_QUERY } from '../ICMCourseBuilder/queries'
import { LeftPane, PanesContainer, RightPane } from '../Panes/Panes'

import { StrategyAccordion } from './components/StrategyAccordion'
import { StrategyAccordionSummary } from './components/StrategyAccordionSummary'
import { hasKeyStartingWith } from './helpers'
import { getDisabledStrategies, getPreselectedModules } from './utils'

function transformSelection(selectedModules: Record<string, boolean>) {
  const transformedSelection: Record<string, Strategy> = {}

  Object.keys(selectedModules).forEach(key => {
    if (selectedModules[key]) {
      const [strategyName, ...parts] = key.split('.')

      if (!transformedSelection[strategyName]) {
        transformedSelection[strategyName] = {
          groups: [],
          modules: [],
        }
      }

      if (parts.length === 2) {
        const [groupName, moduleName] = parts

        const existingGroup = transformedSelection[strategyName].groups?.find(
          group => group.name === groupName
        )

        let group = transformedSelection[strategyName].groups?.find(
          group => group.name === groupName
        ) ?? {
          name: groupName,
          modules: [],
        }

        if (!existingGroup) {
          transformedSelection[strategyName].groups?.push(group)
        } else {
          group = existingGroup
        }

        group.modules.push({ name: moduleName })
      } else if (parts.length === 1) {
        const [module] = parts

        transformedSelection[strategyName].modules?.push({ name: module })
      }
    }
  })

  return transformedSelection
}

type BILDCourseBuilderProps = unknown

const mapCourseLevelToDescriptionDays = cond([
  [
    matches({
      level: CourseLevel.BildAdvancedTrainer,
      reaccreditation: true,
    }),
    constant(3),
  ],
  [
    matches({
      level: CourseLevel.BildAdvancedTrainer,
      conversion: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: CourseLevel.BildAdvancedTrainer,
    }),
    constant(4),
  ],
  [
    matches({
      level: CourseLevel.BildIntermediateTrainer,
      reaccreditation: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: CourseLevel.BildIntermediateTrainer,
      conversion: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: CourseLevel.BildIntermediateTrainer,
    }),
    constant(5),
  ],
  [stubTrue, constant(0)],
])

export const BILDCourseBuilder: React.FC<
  React.PropsWithChildren<BILDCourseBuilderProps>
> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [submitError, setSubmitError] = useState<string>()
  const [disabledStrategies, setDisabledStrategies] = useState<
    Record<string, boolean>
  >({})
  const [selectedModules, setSelectedModules] = useState<
    Record<string, boolean>
  >({})

  const {
    strategies: bildStrategies,
    error: modulesLoadingError,
    isLoading: modulesLoading,
  } = useBildStrategies(true)

  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()

  const courseCreated = Boolean(getSnackbarMessage('course-created'))

  const [{ data: courseData, error: courseDataError }] = useQuery<
    CourseToBuildQuery,
    CourseToBuildQueryVariables
  >({
    query: COURSE_QUERY,
    variables: courseId
      ? { id: Number(courseId), withStrategies: true }
      : undefined,
  })

  const courseDescription = useMemo<string>(() => {
    if (!courseData?.course) return ''

    const days = mapCourseLevelToDescriptionDays(courseData.course)

    if (days === 0)
      return t('pages.trainer-base.create-course.new-course.BILD-description')

    return t(
      'pages.trainer-base.create-course.new-course.BILD-generic-description',
      { days }
    )
  }, [courseData, t])

  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseDataError)

  const setInitialModules = useCallback(() => {
    setSelectedModules(
      courseData?.course
        ? getPreselectedModules({
            courseLevel: courseData.course.level,
            courseStrategies: courseData.course.bildStrategies ?? [],
            allStrategies: bildStrategies,
          })
        : {}
    )
    setDisabledStrategies(
      courseData?.course
        ? getDisabledStrategies({
            courseLevel: courseData?.course?.level,
            courseStrategies: courseData?.course?.bildStrategies ?? [],
          })
        : {}
    )
    setSubmitError(undefined)
  }, [bildStrategies, courseData?.course])

  useEffect(() => {
    if (courseData && Object.keys(selectedModules).length === 0) {
      setInitialModules()
    }
  }, [courseData, selectedModules, setInitialModules])

  const courseStrategies = useMemo(() => {
    return bildStrategies.filter(s =>
      courseData?.course?.bildStrategies?.find(cs => cs.strategyName === s.name)
    )
  }, [bildStrategies, courseData])

  const [saveStrategiesResult, saveStrategies] = useMutation<
    SaveCourseModulesBildMutation,
    SaveCourseModulesBildMutationVariables
  >(SAVE_COURSE_MODULES_BILD_MUTATION)

  const estimatedDuration = useMemo(() => {
    let total = 0

    const groupsSeen: Record<string, boolean> = {}
    const strategySeen: Record<string, boolean> = {}

    Object.keys(selectedModules).forEach(key => {
      if (!selectedModules[key]) return

      const [strategyName, ...parts] = key.split('.')

      const strategy = courseStrategies.find(s => s.name === strategyName)

      if (!strategy) return

      if (strategy.duration) {
        if (strategySeen[strategy.name]) return
        strategySeen[strategy.name] = true
        total += strategy.duration
        return
      }

      // that means there's a group
      if (parts.length === 2) {
        const [groupName, moduleName] = parts
        const group = strategy.modules.groups?.find(g => g.name === groupName)

        if (!group) return

        if (group.duration) {
          if (groupsSeen[group.name]) return
          groupsSeen[group.name] = true
          total += group.duration
          return
        }
        const module = group.modules?.find(m => m.name === moduleName)

        if (!module) return

        total += module.duration ?? 0
      } else {
        const [moduleName] = parts
        const module = strategy.modules.modules?.find(
          m => m.name === moduleName
        )

        if (!module) return

        total += module.duration ?? 0
      }
    })

    return total
  }, [selectedModules, courseStrategies])

  const handleSubmit = async () => {
    const course = courseData?.course
    if (!course) return

    setSubmitError(undefined)

    let hasError = false

    courseData.course?.bildStrategies?.forEach(strategy => {
      const strategyName = strategy.strategyName

      if (strategyName === 'PRIMARY' || strategyName === 'SECONDARY') return

      if (!hasKeyStartingWith(selectedModules, `${strategyName}.`)) {
        hasError = true
        setSubmitError(
          t(
            'pages.trainer-base.create-course.new-course.strategy-validation-error',
            { name: t(`common.bild-strategies.${strategyName}`) }
          )
        )
        return
      }
    })

    if (hasError) return

    const transformedSelection = transformSelection(selectedModules)

    saveStrategies({
      courseId: course.id,
      modules: transformedSelection,
      duration: estimatedDuration,
      status: null,
    })

    if (!courseCreated) {
      addSnackbarMessage('course-submitted', {
        label: (
          <Trans
            i18nKey="pages.trainer-base.create-course.new-course.submitted-course"
            values={{ code: course.course_code }}
          >
            <Link
              underline="always"
              href={`/manage-courses/all/${course.id}/details`}
            >
              {course.course_code}
            </Link>
          </Trans>
        ),
      })
    }

    navigate('../details')
  }

  useEffect(() => {
    if (saveStrategiesResult.data?.course?.id && courseData?.course) {
      if (!courseCreated) {
        addSnackbarMessage('course-submitted', {
          label: (
            <Trans
              i18nKey="pages.trainer-base.create-course.new-course.submitted-course"
              values={{ code: courseData.course?.course_code }}
            >
              <Link
                underline="always"
                href={`/manage-courses/all/${courseData.course.id}/details`}
              >
                {courseData.course.course_code}
              </Link>
            </Trans>
          ),
        })
      }

      navigate('../details')
    }
  })

  if (courseLoadingStatus === LoadingStatus.SUCCESS && !courseData?.course) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  return (
    <Container sx={{ pt: 3 }}>
      {(courseLoadingStatus === LoadingStatus.ERROR || modulesLoadingError) && (
        <Alert severity="error" variant="outlined">
          {t('internal-error')}
        </Alert>
      )}
      {(courseLoadingStatus === LoadingStatus.FETCHING || modulesLoading) && (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      )}

      {bildStrategies.length && courseData?.course && (
        <Box pb={6}>
          <BackButton
            label={t('pages.course-participants.back-button')}
            to="../.."
          />

          {submitError || saveStrategiesResult.error ? (
            <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
              {submitError ||
                t('pages.trainer-base.create-course.new-course.saving-error')}
            </Alert>
          ) : null}

          {courseData.course ? (
            <Hero
              course={courseData.course}
              slots={{ afterTitle: courseDescription }}
            />
          ) : null}

          <PanesContainer>
            <LeftPane>
              <Typography variant="h3">
                {t(
                  'pages.trainer-base.create-course.new-course.modules-available'
                )}
              </Typography>
              <Box
                data-testid="all-modules"
                display="flex"
                flexWrap="wrap"
                mt={{ xs: 2, md: 4 }}
              >
                {courseStrategies.map(s => (
                  <StrategyAccordion
                    id={s.id}
                    key={s.id}
                    expanded={expanded === s.id}
                    onToggle={setExpanded}
                    name={s.name}
                    duration={s.duration}
                    modules={s.modules}
                    state={selectedModules}
                    onChange={o => setSelectedModules(s => ({ ...s, ...o }))}
                    disabled={disabledStrategies[s.name] || false}
                  />
                ))}
              </Box>
            </LeftPane>

            <RightPane>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Typography variant="h3">
                  {t(
                    'pages.trainer-base.create-course.new-course.course-summary'
                  )}
                </Typography>
                <Box>
                  <Typography variant="h6" px={1}>
                    {formatDurationShort(estimatedDuration)}
                  </Typography>
                  <Typography variant="body2" px={1}>
                    {t(
                      'pages.trainer-base.create-course.new-course.estimated-duration'
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                flex={1}
                flexDirection="column"
                my={{ xs: 4, md: 2 }}
                data-testid="course-modules"
              >
                {courseStrategies.map(s =>
                  hasKeyStartingWith(selectedModules, s.name) ? (
                    <StrategyAccordionSummary
                      key={s.id}
                      name={s.name}
                      modules={s.modules}
                      state={selectedModules}
                    />
                  ) : null
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={false}
                  data-testid="submit-button"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {t(
                    'pages.trainer-base.create-course.new-course.submit-course'
                  )}
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={setInitialModules}
                  disabled={false}
                  data-testid="submit-button"
                  fullWidth
                >
                  {t('common.clear')}
                </Button>
              </Box>
            </RightPane>
          </PanesContainer>
        </Box>
      )}
    </Container>
  )
}
