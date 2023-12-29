import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ModuleSettingsQuery } from '@app/generated/graphql'
import { formatDurationShort, getPercentage, isNotNullish } from '@app/util'

import { LeftPane, PanesContainer, RightPane } from '../../../Panes/Panes'
import { ModuleAccordion } from '../ModuleAccordion/ModuleAccordion'

type Props = {
  availableModules: ModuleSettingsQuery['moduleSettings']
  maxDuration?: number
  showDuration?: boolean
  slots?: {
    afterChosenModulesTitle?: React.ReactNode
  }
}

export const ModulesSelection: React.FC<Props> = ({
  availableModules,
  showDuration,
  maxDuration = 0,
  slots,
}) => {
  const { t } = useTranslation()
  const [selectedIds] = useState<string[]>(
    availableModules
      .filter(moduleSetting => moduleSetting.mandatory)
      .map(ms => ms.module.id)
  )

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

  const estimatedCourseDuration = useMemo(() => {
    const selectedGroups = selectedIds
      .map(id =>
        availableModules.find(moduleSetting => moduleSetting.module.id === id)
      )
      .filter(isNotNullish)

    return selectedGroups.reduce(
      (acc, moduleSetting) => acc + (moduleSetting.duration ?? 0),
      0
    )
  }, [selectedIds, availableModules])

  console.log(estimatedCourseDuration)

  const progressPercentage = getPercentage(estimatedCourseDuration, maxDuration)

  return (
    <PanesContainer>
      <LeftPane data-testid="available-modules">
        <Typography variant="h3" mb={4}>
          {t('pages.trainer-base.create-course.new-course.modules-available')}
        </Typography>

        {availableModules.map(moduleSetting => {
          const moduleSelected = selectedIds.includes(moduleSetting.module.id)

          return (
            <ModuleAccordion
              key={moduleSetting.module.id}
              moduleSetting={moduleSetting}
              isSelected={selectedIds.includes(moduleSetting.module.id)}
              renderName={moduleSetting => (
                <FormGroup>
                  <FormControlLabel
                    disabled={moduleSetting.mandatory}
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
                        onChange={console.log}
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

          <Box>
            <Typography variant="h6" px={1} data-testid="progress-bar-label">
              {formatDurationShort(estimatedCourseDuration)}
            </Typography>
            <Typography variant="body2" px={1}>
              {t(
                'pages.trainer-base.create-course.new-course.estimated-duration'
              )}
            </Typography>
          </Box>
        </Box>

        {slots?.afterChosenModulesTitle && (
          <Box mb={3}>{slots?.afterChosenModulesTitle}</Box>
        )}

        <Box mb={6}>
          {selectedIds.map(moduleId => {
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
      </RightPane>
    </PanesContainer>
  )
}
