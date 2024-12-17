import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import * as Sentry from '@sentry/react'
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Level_Enum,
  GetCourseByIdQuery,
  ModuleSettingsQuery,
  SaveCourseModulesBildMutation,
  SaveCourseModulesBildMutationVariables,
} from '@app/generated/graphql'
import { useBildStrategies } from '@app/modules/course/hooks/useBildStrategies'
import { SaveCourse } from '@app/modules/course/pages/CreateCourse/useSaveCourse'
import { SAVE_COURSE_MODULES_BILD } from '@app/modules/course/queries/save-course-modules-bild'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import {
  LoadingStatus,
  Shards,
  formatDurationShort,
  getSWRLoadingStatus,
} from '@app/util'

import { useCourseToBuild } from '../../hooks/useCourseToBuild'
import { getBackButtonForBuilderPage } from '../../utils'
import { Hero } from '../Hero/Hero'
import { ModuleAccordion } from '../ICMCourseBuilderV2/components/ModuleAccordion/ModuleAccordion'
import { useModuleSettings } from '../ICMCourseBuilderV2/hooks/useModuleSettings'
import { LeftPane, PanesContainer, RightPane } from '../Panes/Panes'

import { StrategyAccordion } from './components/StrategyAccordion'
import { StrategyAccordionSummary } from './components/StrategyAccordionSummary'
import { hasKeyStartingWith } from './helpers'
import {
  getDisabledStrategies,
  getPreselectedModules,
  transformBILDModules,
} from './utils'

export type BILDBuilderCourseData = {
  course: Pick<
    Exclude<GetCourseByIdQuery['course'], null | undefined>,
    | 'bildStrategies'
    | 'conversion'
    | 'course_code'
    | 'curriculum'
    | 'deliveryType'
    | 'go1Integration'
    | 'id'
    | 'isDraft'
    | 'level'
    | 'name'
    | 'reaccreditation'
    | 'type'
    | 'updatedAt'
  > & {
    organization?: { name: string }
    schedule: (Pick<
      Exclude<GetCourseByIdQuery['course'], null | undefined>['schedule'][0],
      'end' | 'start' | 'timeZone'
    > & { venue?: { name: string; city: string } | null })[]
  }
}

type BILDCourseBuilderProps = {
  data?: BILDBuilderCourseData
  initialStrategyModules?: Record<string, boolean>
  onModuleSelectionChange?: (data: {
    bildModules: ModuleSettingsQuery['moduleSettings']
    modulesDuration: number
    strategyModules: Record<string, boolean>
  }) => void
  onSubmit?: SaveCourse
}

const mapCourseLevelToDuration = cond([
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
      reaccreditation: true,
    }),
    constant(3),
  ],
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
      conversion: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: Course_Level_Enum.BildAdvancedTrainer,
    }),
    constant(4),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
      reaccreditation: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
      conversion: true,
    }),
    constant(2),
  ],
  [
    matches({
      level: Course_Level_Enum.BildIntermediateTrainer,
    }),
    constant(5),
  ],
  [stubTrue, constant(0)],
])

export const BILDCourseBuilder: React.FC<
  React.PropsWithChildren<BILDCourseBuilderProps>
> = ({ data, initialStrategyModules, onModuleSelectionChange, onSubmit }) => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()
  const { pathname } = useLocation()

  const navigate = useNavigate()
  const { acl } = useAuth()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [submitError, setSubmitError] = useState<string>()
  const [disabledStrategies, setDisabledStrategies] = useState<
    Record<string, boolean>
  >({})
  const [selectedStrategyModules, setSelectedStrategyModules] = useState<
    Record<string, boolean>
  >({})

  const [selectedModules, setSelectedModules] = useState<
    ModuleSettingsQuery['moduleSettings']
  >([])

  const {
    strategies: bildStrategies,
    error: strategiesLoadingError,
    isLoading: strategiesLoading,
  } = useBildStrategies(true)

  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()

  const courseCreated = Boolean(getSnackbarMessage('course-created'))

  const [{ data: existingCourseData, error: courseDataError }] =
    useCourseToBuild({
      courseId: Number(courseId),
      pause: Boolean(data),
      withStrategies: true,
    })

  const courseData = useMemo(
    () => data ?? existingCourseData,
    [data, existingCourseData],
  )

  const isExistingCourse = !data && courseId

  const [
    { data: moduleSettingsData, error: modulesError, fetching: modulesLoading },
  ] = useModuleSettings(courseData?.course, Shards.UK)

  const showDuration = courseData?.course?.level
    ? ![
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ].includes(courseData.course.level)
    : false

  const courseDescription = useMemo<string>(() => {
    if (!courseData?.course) return ''

    const duration = mapCourseLevelToDuration(courseData.course)

    if (duration === 0)
      return t('pages.trainer-base.create-course.new-course.BILD-description')

    if (courseData.course.conversion) {
      return t(
        'pages.trainer-base.create-course.new-course.BILD-generic-description-hours',
        { hours: duration },
      )
    }

    return t(
      'pages.trainer-base.create-course.new-course.BILD-generic-description',
      { days: duration },
    )
  }, [courseData, t])

  const showMandatoryNotice = useMemo(() => {
    const courseLevel = courseData?.course?.level
    return courseLevel === Course_Level_Enum.BildRegular
  }, [courseData?.course])

  const courseLoadingStatus = isExistingCourse
    ? getSWRLoadingStatus(courseData, courseDataError)
    : LoadingStatus.SUCCESS

  const setInitialStrategyModules = useCallback(() => {
    if (
      initialStrategyModules &&
      Object.entries(initialStrategyModules ?? {}).length
    ) {
      setSelectedStrategyModules(initialStrategyModules)
    } else {
      setSelectedStrategyModules(
        courseData?.course
          ? getPreselectedModules({
              courseLevel: courseData.course.level,
              courseStrategies: courseData.course.bildStrategies ?? [],
              allStrategies: bildStrategies,
            })
          : {},
      )
    }

    setDisabledStrategies(
      courseData?.course
        ? getDisabledStrategies({
            courseLevel: courseData?.course?.level,
            courseStrategies: courseData?.course?.bildStrategies ?? [],
          })
        : {},
    )
    setSubmitError(undefined)
  }, [bildStrategies, courseData?.course, initialStrategyModules])

  useEffect(() => {
    if (courseData && Object.keys(selectedStrategyModules).length === 0) {
      setInitialStrategyModules()
    }
  }, [courseData, selectedStrategyModules, setInitialStrategyModules])

  const courseStrategies = useMemo(() => {
    return bildStrategies.filter(s =>
      courseData?.course?.bildStrategies?.find(
        cs => cs.strategyName === s.name,
      ),
    )
  }, [bildStrategies, courseData])

  const [saveStrategiesResult, saveStrategies] = useMutation<
    SaveCourseModulesBildMutation,
    SaveCourseModulesBildMutationVariables
  >(SAVE_COURSE_MODULES_BILD)

  const estimatedDuration = useMemo(() => {
    let total = 0

    const groupsSeen: Record<string, boolean> = {}
    const strategySeen: Record<string, boolean> = {}

    Object.keys(selectedStrategyModules).forEach(key => {
      if (!selectedStrategyModules[key]) return

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
          m => m.name === moduleName,
        )

        if (!module) return

        total += module.duration ?? 0
      }
    })

    return total
  }, [selectedStrategyModules, courseStrategies])

  useEffect(() => {
    if (onModuleSelectionChange) {
      onModuleSelectionChange({
        bildModules: selectedModules,
        modulesDuration: estimatedDuration,
        strategyModules: selectedStrategyModules,
      })
    }
  }, [
    estimatedDuration,
    onModuleSelectionChange,
    selectedModules,
    selectedStrategyModules,
  ])

  const handleSubmit = async () => {
    const course = courseData?.course
    if (!course) return

    setSubmitError(undefined)

    let hasError = false

    courseData.course?.bildStrategies?.forEach(strategy => {
      const strategyName = strategy.strategyName

      if (strategyName === 'PRIMARY' || strategyName === 'SECONDARY') return

      if (!hasKeyStartingWith(selectedStrategyModules, `${strategyName}.`)) {
        hasError = true
        setSubmitError(
          t(
            'pages.trainer-base.create-course.new-course.strategy-validation-error',
            { name: t(`common.bild-strategies.${strategyName}`) },
          ),
        )
      }
    })

    if (hasError) return

    let id = Number(courseId)
    let courseCode = courseData?.course?.course_code

    try {
      if (onSubmit) {
        const resp = await onSubmit()

        id = Number(resp?.id)
        courseCode = resp?.courseCode
      } else {
        await saveStrategies({
          courseId: course.id,
          modules: transformBILDModules({
            modules: selectedModules,
            strategyModules: selectedStrategyModules,
          }),
          duration: estimatedDuration,
          status: null,
        })
      }
    } catch (e) {
      Sentry.captureException(e)
    }

    if (!courseCreated) {
      addSnackbarMessage('course-submitted', {
        label: (
          <Trans
            i18nKey="pages.trainer-base.create-course.new-course.submitted-course"
            values={{ code: courseCode }}
          >
            <Link
              underline="always"
              href={`/${
                acl.isInternalUser() ? 'manage-courses/all' : 'courses'
              }/${id}/details`}
            >
              {courseCode}
            </Link>
          </Trans>
        ),
      })
    }

    navigate(
      `/${
        acl.isInternalUser() ? 'manage-courses/all' : 'courses'
      }/${id}/details`,
    )
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

  useEffect(() => {
    if (moduleSettingsData?.moduleSettings.length) {
      setSelectedModules(
        moduleSettingsData.moduleSettings.filter(
          moduleSetting => moduleSetting.mandatory,
        ),
      )
    }
  }, [moduleSettingsData])

  const backButton = useMemo(() => {
    return getBackButtonForBuilderPage({
      editMode: false,
      existsCourse: Boolean(courseId) && !pathname.includes('draft'),
      isInternalUser: acl.isInternalUser(),
    })
  }, [acl, courseId, pathname])

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
      {courseLoadingStatus === LoadingStatus.ERROR ||
      strategiesLoadingError ||
      modulesError ? (
        <Alert severity="error" variant="outlined">
          {t('internal-error')}
        </Alert>
      ) : null}
      {courseLoadingStatus === LoadingStatus.FETCHING ||
      strategiesLoading ||
      modulesLoading ? (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      ) : null}

      {Boolean(bildStrategies.length) &&
        !!courseData?.course &&
        !modulesLoading && (
          <Box pb={6}>
            <BackButton label={backButton.label} to={backButton.to} />

            {submitError || saveStrategiesResult.error ? (
              <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                {submitError ||
                  t('pages.trainer-base.create-course.new-course.saving-error')}
              </Alert>
            ) : null}

            {courseData.course ? (
              <Hero
                course={courseData.course}
                showMandatoryNotice={showMandatoryNotice}
                slots={{
                  afterTitle: courseDescription,
                }}
              />
            ) : null}

            <PanesContainer>
              <LeftPane data-testid="all-modules">
                <Typography variant="h3" mb={4}>
                  {t(
                    'pages.trainer-base.create-course.new-course.modules-available',
                  )}
                </Typography>
                <Box display="flex" flexDirection="column">
                  {courseStrategies.map(s => (
                    <StrategyAccordion
                      id={s.id}
                      key={s.id}
                      expanded={expanded === s.id}
                      onToggle={setExpanded}
                      name={s.name}
                      duration={s.duration}
                      modules={s.modules}
                      state={selectedStrategyModules}
                      onChange={o =>
                        setSelectedStrategyModules(s => ({ ...s, ...o }))
                      }
                      disabled={disabledStrategies[s.name] || false}
                      showAsterisk={
                        (showMandatoryNotice && disabledStrategies[s.name]) ||
                        false
                      }
                      showDuration={showDuration}
                      sx={{
                        order: s.sort,
                      }}
                    />
                  ))}

                  {moduleSettingsData?.moduleSettings.length
                    ? moduleSettingsData.moduleSettings.map(moduleSetting => (
                        <ModuleAccordion
                          key={moduleSetting.module.id}
                          moduleSetting={moduleSetting}
                          isSelected={true}
                          sx={{
                            mb: 2,
                            order:
                              moduleSetting.sort ?? Number.MAX_SAFE_INTEGER,
                          }}
                          renderName={moduleSetting => (
                            <FormGroup>
                              <FormControlLabel
                                disabled={moduleSetting.mandatory}
                                control={
                                  <Checkbox
                                    id={moduleSetting.module.id}
                                    disableRipple
                                    icon={<UncheckedIcon color="inherit" />}
                                    checkedIcon={
                                      <CheckedAllIcon color="inherit" />
                                    }
                                    color="default"
                                    sx={{
                                      color: 'white',
                                    }}
                                    value={moduleSetting.module.id}
                                    checked={true}
                                  />
                                }
                                label={
                                  <>
                                    <Typography
                                      color="white"
                                      data-testid="module-name"
                                    >
                                      <span>
                                        {moduleSetting.module.displayName ??
                                          moduleSetting.module.name}
                                      </span>
                                    </Typography>
                                    {moduleSetting.duration ? (
                                      <Typography variant="body2" color="white">
                                        {t('minimum')}{' '}
                                        <span data-testid="module-duration">
                                          {formatDurationShort(
                                            moduleSetting.duration,
                                          )}
                                        </span>
                                      </Typography>
                                    ) : null}
                                  </>
                                }
                              />
                            </FormGroup>
                          )}
                        />
                      ))
                    : null}
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
                      'pages.trainer-base.create-course.new-course.course-summary',
                    )}
                  </Typography>
                  {showDuration ? (
                    <Box>
                      <Typography variant="h6" px={1}>
                        {formatDurationShort(estimatedDuration)}
                      </Typography>
                      <Typography variant="body2" px={1}>
                        {t(
                          'pages.trainer-base.create-course.new-course.estimated-duration',
                        )}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  my={{ xs: 4, md: 2 }}
                  data-testid="course-modules"
                >
                  {courseStrategies.map(s =>
                    hasKeyStartingWith(selectedStrategyModules, s.name) ? (
                      <StrategyAccordionSummary
                        key={s.id}
                        name={s.name}
                        modules={s.modules}
                        state={selectedStrategyModules}
                        showAsterisk={
                          (showMandatoryNotice && disabledStrategies[s.name]) ||
                          false
                        }
                        sx={{ order: s.sort }}
                      />
                    ) : null,
                  )}

                  {selectedModules.map(moduleSetting => (
                    <ModuleAccordion
                      key={moduleSetting.module.id}
                      moduleSetting={moduleSetting}
                      isSelected
                      sx={{
                        mb: 2,
                        order: moduleSetting.sort ?? Number.MAX_SAFE_INTEGER,
                      }}
                      data-testid={`selected-module-group-${moduleSetting.module.id}`}
                      renderName={moduleSetting => (
                        <Box display="flex" alignItems="center">
                          <CheckedAllIcon color="inherit" />

                          <Box ml={1.5}>
                            <Typography data-testid="module-name">
                              <span>
                                {moduleSetting.module.displayName ??
                                  moduleSetting.module.name}
                              </span>
                            </Typography>
                            {moduleSetting.duration ? (
                              <Typography variant="body2" color="white">
                                {t('minimum')}{' '}
                                <span data-testid="module-duration">
                                  {formatDurationShort(moduleSetting.duration)}
                                </span>
                              </Typography>
                            ) : null}
                          </Box>
                        </Box>
                      )}
                    />
                  ))}
                </Box>

                <Box mt={4}>
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
                      'pages.trainer-base.create-course.new-course.submit-course',
                    )}
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={setInitialStrategyModules}
                    disabled={false}
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
