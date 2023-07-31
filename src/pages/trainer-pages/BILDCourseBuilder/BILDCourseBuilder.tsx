import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { BackButton } from '@app/components/BackButton'
import { useSnackbar } from '@app/context/snackbar'
import {
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
  SaveCourseModulesBildMutation,
  SaveCourseModulesBildMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { NotFound } from '@app/pages/common/NotFound'
import { QUERY as GET_COURSE_BY_ID_QUERY } from '@app/queries/courses/get-course-by-id'
import { MUTATION as SAVE_COURSE_MODULES_BILD_MUTATION } from '@app/queries/courses/save-course-modules-bild'
import { CourseLevel } from '@app/types'
import {
  LoadingStatus,
  formatDurationShort,
  getSWRLoadingStatus,
} from '@app/util'

import { CourseInfo } from '../CourseBuilder/components/CourseInfo'
import { Strategy } from '../CourseGrading/components/BILDGrading/types'

import { StrategyAccordion } from './components/StrategyAccordion'
import { StrategyAccordionSummary } from './components/StrategyAccordionSummary'
import { hasKeyStartingWith } from './helpers'

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const fetcher = useFetcher()
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

  const { data: courseData, error: courseDataError } = useSWR<
    GetCourseByIdQuery,
    Error,
    [string, GetCourseByIdQueryVariables] | null
  >(courseId ? [GET_COURSE_BY_ID_QUERY, { id: Number(courseId) }] : null)

  const courseDescription = useMemo<string>(() => {
    if (!courseData?.course) return ''

    const days = mapCourseLevelToDescriptionDays(
      (courseData as GetCourseByIdQuery).course
    )

    if (days === 0)
      return t('pages.trainer-base.create-course.new-course.BILD-description')

    return t(
      'pages.trainer-base.create-course.new-course.BILD-generic-description',
      { days }
    )
  }, [courseData, t])

  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseDataError)

  const getInitialData = useCallback(() => {
    const courseStrategies = courseData?.course?.bildStrategies
    const preselectedModules: Record<string, boolean> = {}

    if (!courseStrategies?.length) return

    const hasPrimary = courseStrategies.some(s => s.strategyName === 'PRIMARY')
    const hasSecondary = courseStrategies.some(
      s => s.strategyName === 'SECONDARY'
    )

    const primaryStrategy = hasPrimary
      ? bildStrategies.find(s => s.name === 'PRIMARY')
      : null
    const secondaryStrategy = hasSecondary
      ? bildStrategies.find(s => s.name === 'SECONDARY')
      : null

    if (primaryStrategy) {
      primaryStrategy?.modules.modules?.forEach(module => {
        preselectedModules[`PRIMARY.${module.name}`] = true
      })

      primaryStrategy.modules.groups?.forEach(group => {
        group.modules?.forEach(module => {
          preselectedModules[`PRIMARY.${group.name}.${module.name}`] = true
        })
      })
    }

    if (secondaryStrategy) {
      secondaryStrategy.modules.modules?.forEach(module => {
        preselectedModules[`SECONDARY.${module.name}`] = true
      })

      secondaryStrategy.modules.groups?.forEach(group => {
        group.modules?.forEach(module => {
          preselectedModules[`SECONDARY.${group.name}.${module.name}`] = true
        })
      })
    }

    return { preselectedModules, hasPrimary, hasSecondary }
  }, [bildStrategies, courseData?.course])

  const resetBuilder = useCallback(() => {
    const initialData = getInitialData()
    if (!initialData) return

    const { preselectedModules, hasPrimary, hasSecondary } = initialData
    setSelectedModules(preselectedModules)
    setDisabledStrategies({
      PRIMARY: hasPrimary,
      SECONDARY: hasSecondary,
    })
    setSubmitError(undefined)
  }, [getInitialData])

  useEffect(() => {
    resetBuilder()
  }, [resetBuilder])

  const courseStrategies = useMemo(() => {
    return bildStrategies.filter(s =>
      courseData?.course?.bildStrategies.find(cs => cs.strategyName === s.name)
    )
  }, [bildStrategies, courseData])

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

    try {
      const transformedSelection = transformSelection(selectedModules)

      await fetcher<
        SaveCourseModulesBildMutation,
        SaveCourseModulesBildMutationVariables
      >(SAVE_COURSE_MODULES_BILD_MUTATION, {
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
    } catch (e: unknown) {
      setSubmitError((e as Error).message)
    }
  }

  if (courseLoadingStatus === LoadingStatus.SUCCESS && !courseData?.course) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  return (
    <>
      {(courseLoadingStatus === LoadingStatus.ERROR || modulesLoadingError) && (
        <Alert severity="error" variant="filled">
          {t('internal-error')}
        </Alert>
      )}
      {(courseLoadingStatus === LoadingStatus.FETCHING || modulesLoading) && (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      )}

      {bildStrategies.length && courseData?.course && (
        <Box
          pt={{ xs: 2, md: 10 }}
          pb={12}
          margin="auto"
          maxWidth={{ xs: '340px', md: '1040px' }}
          height="100%"
        >
          <BackButton
            label={t('pages.course-participants.back-button')}
            to="../.."
          />
          <Typography variant="h2">{courseData.course.name}</Typography>

          {submitError && (
            <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box
            mt={{ xs: 2, md: 3 }}
            sx={{
              display: 'flex',
              height: '100%',
            }}
            flexDirection="column"
          >
            <Box
              sx={{ display: 'flex' }}
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <Box>
                <Typography variant="body2">{courseDescription}</Typography>
              </Box>
              <Box data-testid="course-info" mt={isMobile ? 2 : 0}>
                <CourseInfo data={courseData.course} />
              </Box>
            </Box>

            <Divider sx={{ width: '100%', my: 3 }} />

            <Box
              flexDirection={isMobile ? 'column' : 'row'}
              sx={{ display: 'flex', flex: isMobile ? undefined : 1 }}
            >
              <Box flex={1} pr={isMobile ? 0 : 8}>
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
              </Box>

              <Box
                sx={
                  isMobile
                    ? {}
                    : {
                        flex: 1,
                        pl: 8,
                        pb: 4,
                        boxShadow: '-10px 0px 10px -3px #EEE',
                        mt: -4,
                        pt: 4,
                      }
                }
              >
                <Box
                  sx={
                    isMobile
                      ? {}
                      : {
                          position: 'sticky',
                          minHeight: 'calc(100vh - 50px)',
                          top: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                        }
                  }
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h3" px={1}>
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
                      onClick={resetBuilder}
                      disabled={false}
                      data-testid="submit-button"
                      fullWidth
                    >
                      {t('common.clear')}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
