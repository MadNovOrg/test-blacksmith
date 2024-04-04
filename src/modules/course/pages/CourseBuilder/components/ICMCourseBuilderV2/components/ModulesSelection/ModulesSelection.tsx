import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'react-use'
import { noop } from 'ts-essentials'

import { ModuleSettingsQuery } from '@app/generated/graphql'
import { formatDurationShort, getPercentage, isNotNullish } from '@app/util'

import { LeftPane, PanesContainer, RightPane } from '../../../Panes/Panes'
import { ModuleAccordion } from '../ModuleAccordion/ModuleAccordion'

export type CallbackFn = ({
  selectedIds,
  estimatedDuration,
  previousIds,
}: {
  selectedIds: string[]
  previousIds?: string[]
  estimatedDuration: number
}) => void

type Props = {
  availableModules: ModuleSettingsQuery['moduleSettings']
  initialSelection?: string[]
  onChange?: CallbackFn
  onSubmit?: CallbackFn
  maxDuration?: number
  showDuration?: boolean
  submitting?: boolean
  validateSelection?: (selectedIds: string[]) => boolean
  slots?: {
    afterChosenModulesTitle?: React.ReactNode
  }
}

export const ModulesSelection: React.FC<Props> = ({
  availableModules,
  initialSelection = [],
  showDuration,
  maxDuration = 0,
  submitting = false,
  onChange = noop,
  onSubmit = noop,
  validateSelection = () => true,
  slots,
}) => {
  const { t } = useTranslation()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set([
      ...availableModules
        .filter(moduleSetting => moduleSetting.mandatory)
        .map(ms => ms.module.id),
      ...initialSelection,
    ])
  )

  const initialSelectionRef = useRef(selectedIds)
  const previousIds = usePrevious(selectedIds)
  const dependableModuleIds = useRef<Set<string>>(new Set())

  const availableModulesMap = useMemo(() => {
    const modules = new Map<string, (typeof availableModules)[0]>()

    availableModules?.forEach(moduleSetting => {
      modules.set(moduleSetting.module.id, moduleSetting)
    })

    return modules
  }, [availableModules])

  const allModulesMandatory =
    availableModules.filter(moduleSetting => !moduleSetting.mandatory)
      .length === 0

  const estimatedDuration = useMemo(() => {
    const selectedGroups = Array.from(selectedIds)
      .map(id =>
        availableModules.find(moduleSetting => moduleSetting.module.id === id)
      )
      .filter(isNotNullish)

    return selectedGroups.reduce(
      (acc, moduleSetting) => acc + (moduleSetting.duration ?? 0),
      0
    )
  }, [selectedIds, availableModules])

  const progressPercentage = getPercentage(estimatedDuration, maxDuration)

  const handleModuleToggle = (moduleId: string) => {
    const selection = new Set(selectedIds)
    const moduleDependencies = availableModulesMap.get(moduleId)?.dependencies

    if (selection.has(moduleId)) {
      selection.delete(moduleId)

      moduleDependencies?.forEach(d => {
        dependableModuleIds.current.delete(d.dependency.module.id)
      })
    } else {
      selection.add(moduleId)

      moduleDependencies?.forEach(d => {
        dependableModuleIds.current.add(d.dependency.module.id)
        selection.add(d.dependency.module.id)
      })
    }

    setSelectedIds(selection)
  }

  useEffect(() => {
    onChange({
      selectedIds: Array.from(selectedIds),
      previousIds: previousIds ? Array.from(previousIds) : undefined,
      estimatedDuration,
    })
  }, [selectedIds, estimatedDuration, onChange, previousIds])

  const sortedSelection = useMemo(() => {
    const selection = Array.from(selectedIds)

    selection.sort((a, b) => {
      const aSort = availableModulesMap.get(a)?.sort ?? 100
      const bSort = availableModulesMap.get(b)?.sort ?? 100

      return aSort > bSort ? 1 : -1
    })

    return selection
  }, [selectedIds, availableModulesMap])

  const submitModules = () => {
    onSubmit({ selectedIds: Array.from(selectedIds), estimatedDuration })
  }

  const clearSelection = () => {
    setSelectedIds(initialSelectionRef.current)
  }

  return (
    <PanesContainer>
      <LeftPane data-testid="available-modules">
        <Typography variant="h3" mb={4}>
          {t('pages.trainer-base.create-course.new-course.modules-available')}
        </Typography>

        {availableModules.map(moduleSetting => {
          const moduleSelected = selectedIds.has(moduleSetting.module.id)

          return (
            <ModuleAccordion
              key={moduleSetting.module.id}
              moduleSetting={moduleSetting}
              isSelected={moduleSelected}
              data-testid={`available-module-group-${moduleSetting.module.id}`}
              renderName={moduleSetting => (
                <FormGroup>
                  <FormControlLabel
                    disabled={
                      moduleSetting.mandatory ||
                      dependableModuleIds.current.has(moduleSetting.module.id)
                    }
                    control={
                      <Checkbox
                        id={moduleSetting.module.id}
                        disableRipple
                        icon={<UncheckedIcon color="inherit" />}
                        checkedIcon={<CheckedAllIcon color="inherit" />}
                        color="default"
                        sx={{
                          color: 'white',
                        }}
                        checked={moduleSelected}
                        onChange={() => {
                          handleModuleToggle(moduleSetting.module.id)
                        }}
                        value={moduleSetting.module.id}
                      />
                    }
                    label={
                      <>
                        <Typography color="white" data-testid="module-name">
                          <span>
                            {moduleSetting.module.displayName ??
                              moduleSetting.module.name}
                          </span>
                          {!allModulesMandatory && moduleSetting.mandatory ? (
                            <span> *</span>
                          ) : null}
                        </Typography>
                        {moduleSetting.duration ? (
                          <Typography variant="body2" color="white">
                            {t('minimum')}{' '}
                            <span data-testid="module-duration">
                              {formatDurationShort(moduleSetting.duration)}
                            </span>
                          </Typography>
                        ) : null}
                      </>
                    }
                  />
                </FormGroup>
              )}
            />
          )
        })}
      </LeftPane>
      <RightPane
        data-testid="selected-modules"
        slots={{
          beforeContent: showDuration ? (
            <LinearProgress
              variant="determinate"
              value={progressPercentage > 100 ? 100 : progressPercentage}
            />
          ) : null,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h3">
            {t('pages.trainer-base.create-course.new-course.course-summary')}
          </Typography>
          {showDuration ? (
            <Box data-testid="course-estimated-duration">
              <Typography variant="h6" px={1} data-testid="progress-bar-label">
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

        {slots?.afterChosenModulesTitle && (
          <Box mb={3}>{slots?.afterChosenModulesTitle}</Box>
        )}

        <Box mb={6}>
          {sortedSelection.map(moduleId => {
            const selectedModule = moduleId
              ? availableModulesMap.get(moduleId)
              : null

            if (!selectedModule) {
              return null
            }

            return (
              <ModuleAccordion
                key={selectedModule.module.id}
                moduleSetting={selectedModule}
                isSelected
                data-testid={`selected-module-group-${selectedModule.module.id}`}
                renderName={moduleSetting => (
                  <Box display="flex" alignItems="center">
                    <CheckedAllIcon color="inherit" />

                    <Box ml={1.5}>
                      <Typography data-testid="module-name">
                        <span>
                          {moduleSetting.module.displayName ??
                            moduleSetting.module.name}
                        </span>
                        <span>
                          {!allModulesMandatory && moduleSetting.mandatory ? (
                            <span> *</span>
                          ) : null}
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
            )
          })}
        </Box>

        <Box>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}
            loading={submitting}
            disabled={
              !selectedIds.size || !validateSelection(Array.from(selectedIds))
            }
            onClick={submitModules}
            data-testid="submit-button"
          >
            {t('submit')}
          </LoadingButton>
          <Button
            variant="outlined"
            fullWidth
            size="medium"
            disabled={!selectedIds.size}
            onClick={clearSelection}
            sx={{ fontWeight: 600, fontSize: '16px' }}
            data-testid="clear-button"
          >
            {t('clear')}
          </Button>
        </Box>
      </RightPane>
    </PanesContainer>
  )
}
