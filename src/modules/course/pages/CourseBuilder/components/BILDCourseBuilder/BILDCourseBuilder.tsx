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
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Level_Enum,
  ModuleSettingsQuery,
  SaveCourseModulesBildMutation,
  SaveCourseModulesBildMutationVariables,
} from '@app/generated/graphql'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { NotFound } from '@app/pages/common/NotFound'
import { MUTATION as SAVE_COURSE_MODULES_BILD_MUTATION } from '@app/queries/courses/save-course-modules-bild'
import { Strategy } from '@app/types'
import {
  LoadingStatus,
  formatDurationShort,
  getSWRLoadingStatus,
} from '@app/util'

import { useCourseToBuild } from '../../hooks/useCourseToBuild'
import { Hero } from '../Hero/Hero'
import { ModuleAccordion } from '../ICMCourseBuilderV2/components/ModuleAccordion/ModuleAccordion'
import { useModuleSettings } from '../ICMCourseBuilderV2/hooks/useModuleSettings'
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
> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const navigate = useNavigate()
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

  const [{ data: courseData, error: courseDataError }] = useCourseToBuild({
    courseId: Number(courseId),
    withStrategies: true,
  })

  const [
    { data: moduleSettingsData, error: modulesError, fetching: modulesLoading },
  ] = useModuleSettings(courseData?.course)

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
        { hours: duration }
      )
    }

    return t(
      'pages.trainer-base.create-course.new-course.BILD-generic-description',
      { days: duration }
    )
  }, [courseData, t])

  const showMandatoryNotice = useMemo(() => {
    const courseLevel = courseData?.course?.level
    return courseLevel === Course_Level_Enum.BildRegular
  }, [courseData?.course])

  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseDataError)

  const setInitialStrategyModules = useCallback(() => {
    setSelectedStrategyModules(
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
    if (courseData && Object.keys(selectedStrategyModules).length === 0) {
      setInitialStrategyModules()
    }
  }, [courseData, selectedStrategyModules, setInitialStrategyModules])

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
          m => m.name === moduleName
        )

        if (!module) return

        total += module.duration ?? 0
      }
    })

    return total
  }, [selectedStrategyModules, courseStrategies])

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
            { name: t(`common.bild-strategies.${strategyName}`) }
          )
        )
        return
      }
    })

    if (hasError) return

    const transformedSelection = transformSelection(selectedStrategyModules)
    const modulesSelection: Record<string, { groups: []; modules: unknown[] }> =
      {}

    selectedModules.forEach(moduleSetting => {
      modulesSelection[
        moduleSetting.module.displayName ?? moduleSetting.module.name
      ] = {
        groups: [],
        modules: moduleSetting.module.lessons.items,
      }
    })

    saveStrategies({
      courseId: course.id,
      modules: { ...transformedSelection, ...modulesSelection },
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

  useEffect(() => {
    if (moduleSettingsData?.moduleSettings.length) {
      setSelectedModules(
        moduleSettingsData.moduleSettings.filter(
          moduleSetting => moduleSetting.mandatory
        )
      )
    }
  }, [moduleSettingsData])

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

      {bildStrategies.length && courseData?.course && !modulesLoading && (
        <Box pb={6}>
          <BackButton label={t('pages.course-participants.back-button')} />

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
                  'pages.trainer-base.create-course.new-course.modules-available'
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
                          order: moduleSetting.sort ?? Number.MAX_SAFE_INTEGER,
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
                                          moduleSetting.duration
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
                    'pages.trainer-base.create-course.new-course.course-summary'
                  )}
                </Typography>
                {showDuration ? (
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
                  ) : null
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
                    'pages.trainer-base.create-course.new-course.submit-course'
                  )}
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={setInitialStrategyModules}
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
