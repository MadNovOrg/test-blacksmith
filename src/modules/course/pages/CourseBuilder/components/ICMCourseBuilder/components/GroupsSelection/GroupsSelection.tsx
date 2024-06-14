import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { LoadingButton } from '@mui/lab'
import {
  Typography,
  Accordion,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  LinearProgress,
  Box,
  Button,
  useTheme,
} from '@mui/material'
import { t } from 'i18next'
import { memo } from 'react'
import React, { useEffect, useMemo, useState } from 'react'
import { usePrevious, useEffectOnce } from 'react-use'

import {
  Color_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  ModuleGroupsQuery,
} from '@app/generated/graphql'
import {
  LeftPane,
  PanesContainer,
  RightPane,
} from '@app/modules/course/pages/CourseBuilder/components/Panes/Panes'
import { getPercentage, formatDurationShort, isNotNullish } from '@app/util'

import { StyledAccordionSummary, StyledAccordionDetails } from '../styled'

export type CallbackFn = (data: {
  groupIds: string[]
  estimatedDuration: number
}) => void

type ModuleGroup = ModuleGroupsQuery['groups'][0]

type Props = {
  availableGroups: NonNullable<ModuleGroupsQuery['groups']>
  initialGroups: NonNullable<ModuleGroupsQuery['groups']>
  mandatoryGroups: NonNullable<ModuleGroupsQuery['groups']>
  showDuration?: boolean
  purpleModuleIds?: string[]
  level?: Course_Level_Enum
  type?: Course_Type_Enum
  maxDuration?: number
  slots?: {
    afterChosenModulesTitle?: React.ReactNode
  }
  onSubmit?: CallbackFn
  onChange?: CallbackFn
}

const GroupsSelection: React.FC<Props> = ({
  availableGroups,
  initialGroups,
  mandatoryGroups,
  purpleModuleIds,
  level,
  type,
  showDuration = true,
  maxDuration = 0,
  slots,
  onSubmit,
  onChange,
}) => {
  const theme = useTheme()

  const isFoundationTrainerPlusCourse =
    level === Course_Level_Enum.FoundationTrainerPlus &&
    type === Course_Type_Enum.Open

  const [selectedIds, setSelectedIds] = useState<string[]>(
    !initialGroups.length
      ? mandatoryGroups.map(group => group.id)
      : initialGroups.map(group => group.id)
  )

  const hideAsterisk = useMemo(() => {
    return type === Course_Type_Enum.Open
  }, [type])

  const previousIds = usePrevious(
    selectedIds.length ? selectedIds : mandatoryGroups.map(group => group.id)
  )

  const availableGroupsMap = useMemo(() => {
    const groups = new Map<string, ModuleGroup>()

    availableGroups?.forEach(moduleGroup => {
      groups.set(moduleGroup.id, moduleGroup)
    })

    return groups
  }, [availableGroups])

  function getModuleCardColor(color: Color_Enum) {
    const moduleColor = theme.colors[color]

    return moduleColor[500]
  }

  const estimatedCourseDuration = useMemo(() => {
    const selectedGroups = selectedIds
      .map(id => (id ? availableGroupsMap.get(id) : null))
      .filter(isNotNullish)

    return [...selectedGroups].reduce(
      (sum, module) => sum + (module?.duration?.aggregate?.sum?.duration ?? 0),
      0
    )
  }, [selectedIds, availableGroupsMap])

  const [dynamicMandatoryIds, setDynamicMandatoryIds] = useState<string[]>([])

  useEffectOnce(() => {
    const initialDynamicMandatoryIdsSet = new Set<string>()

    selectedIds.forEach(id => {
      const group = availableGroupsMap.get(id)
      if (group?.requires) {
        group.requires.forEach((requiredId: string) =>
          initialDynamicMandatoryIdsSet.add(requiredId)
        )
      }
    })

    setDynamicMandatoryIds(Array.from(initialDynamicMandatoryIdsSet))
  })

  const handleGroupClick = (groupId: string) => {
    const selectedIdsSet = new Set(selectedIds)
    const dynamicMandatoryIdsSet = new Set(dynamicMandatoryIds)

    if (selectedIdsSet.has(groupId)) {
      selectedIdsSet.delete(groupId)
    } else {
      selectedIdsSet.add(groupId)
    }

    dynamicMandatoryIdsSet.clear()

    selectedIdsSet.forEach(id => {
      const group = availableGroupsMap.get(id)
      if (group?.requires) {
        group.requires.forEach((requiredId: string) => {
          dynamicMandatoryIdsSet.add(requiredId)
          selectedIdsSet.add(requiredId)
        })
      }
    })

    dynamicMandatoryIdsSet.forEach(id => {
      const isStillRequired = Array.from(selectedIdsSet).some(selectedId => {
        const group = availableGroupsMap.get(selectedId)
        return group?.requires?.includes(id)
      })

      if (!isStillRequired) {
        dynamicMandatoryIdsSet.delete(id)
      }
    })

    setSelectedIds(Array.from(selectedIdsSet))
    setDynamicMandatoryIds(Array.from(dynamicMandatoryIdsSet))
  }

  const submitButtonHandler = () => {
    if (onSubmit) {
      onSubmit({
        groupIds: selectedIds,
        estimatedDuration: estimatedCourseDuration,
      })
    }
  }

  useEffect(() => {
    if (onChange && previousIds && selectedIds.length !== previousIds?.length) {
      onChange({
        groupIds: selectedIds,
        estimatedDuration: estimatedCourseDuration,
      })
    }
  }, [selectedIds, previousIds, onChange, estimatedCourseDuration])

  const clearSelection = () => {
    setSelectedIds(mandatoryGroups.map(group => group.id))
  }

  const progressPercentage = getPercentage(estimatedCourseDuration, maxDuration)

  return (
    <PanesContainer>
      <LeftPane data-testid="available-modules">
        <Typography variant="h3" mb={4}>
          {t('pages.trainer-base.create-course.new-course.modules-available')}
        </Typography>

        {availableGroups.map(moduleGroup => {
          const isMandatory =
            mandatoryGroups.includes(moduleGroup) ||
            dynamicMandatoryIds.includes(moduleGroup.id) ||
            type === Course_Type_Enum.Open

          const hideDuration =
            !isFoundationTrainerPlusCourse &&
            moduleGroup.duration.aggregate?.sum?.duration

          return (
            <Accordion
              key={moduleGroup.id}
              disableGutters
              sx={{ mb: 2 }}
              TransitionProps={{ timeout: 0 }}
              data-testid={`available-module-group-${moduleGroup.id}`}
            >
              <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                sx={{
                  backgroundColor: getModuleCardColor(moduleGroup.color),
                  opacity:
                    selectedIds.includes(moduleGroup.id) || isMandatory
                      ? 0.6
                      : 1,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={isMandatory}
                    control={
                      <Checkbox
                        id={moduleGroup.id}
                        disableRipple
                        icon={<UncheckedIcon color="inherit" />}
                        checkedIcon={<CheckedAllIcon color="inherit" />}
                        color="default"
                        sx={{
                          color: 'white',
                        }}
                        checked={selectedIds.includes(moduleGroup.id)}
                        onChange={() => handleGroupClick(moduleGroup.id)}
                        value={moduleGroup.id}
                      />
                    }
                    label={
                      <>
                        <Typography color="white" data-testid="module-name">
                          <span>{moduleGroup.name}</span>
                          {!hideAsterisk && isMandatory ? (
                            <span> *</span>
                          ) : null}
                        </Typography>
                        {hideDuration && (
                          <Typography variant="body2" color="white">
                            {t('minimum')}{' '}
                            <span data-testid="module-duration">
                              {formatDurationShort(
                                moduleGroup.duration.aggregate?.sum?.duration ??
                                  0
                              )}
                            </span>
                          </Typography>
                        )}
                      </>
                    }
                  />
                </FormGroup>
              </StyledAccordionSummary>

              <StyledAccordionDetails
                sx={{ borderColor: getModuleCardColor(moduleGroup.color) }}
              >
                <Stack spacing={1}>
                  {moduleGroup.modules &&
                    moduleGroup.modules !== undefined &&
                    moduleGroup.modules.map((g, index) => (
                      <Box key={index}>
                        <Box display="flex" alignItems="center">
                          <Typography>{g.name || t('common.group')}</Typography>
                        </Box>
                        <Box sx={{ ml: 4 }}>
                          {g?.submodules?.length > 0 &&
                            g.submodules.map(m => (
                              <Box key={m.name}>
                                <Typography>{m.name}</Typography>
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    ))}
                </Stack>
              </StyledAccordionDetails>
            </Accordion>
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
          ) : null}
        </Box>

        {slots?.afterChosenModulesTitle && (
          <Box mb={3}>{slots?.afterChosenModulesTitle}</Box>
        )}

        <Box mb={6}>
          {selectedIds.map(groupId => {
            const selectedGroup = groupId
              ? availableGroupsMap.get(groupId)
              : null

            if (!selectedGroup) {
              return null
            }

            const hideDuration =
              !isFoundationTrainerPlusCourse &&
              selectedGroup.duration.aggregate?.sum?.duration

            return (
              <Accordion
                key={groupId}
                sx={{ mb: 2 }}
                disableGutters
                TransitionProps={{ timeout: 0 }}
                data-testid={`selected-module-group-${selectedGroup.id}`}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                  sx={{
                    backgroundColor: getModuleCardColor(selectedGroup.color),
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <CheckedAllIcon color="inherit" />

                    <Box ml={1.5}>
                      <Typography data-testid="module-name">
                        <span>{selectedGroup.name}</span>
                        <span>
                          {!hideAsterisk &&
                          (selectedGroup.mandatory ||
                            dynamicMandatoryIds.includes(selectedGroup.id) ||
                            mandatoryGroups.includes(selectedGroup.id)) ? (
                            <span> *</span>
                          ) : null}
                        </span>
                      </Typography>
                      {hideDuration && (
                        <Typography variant="body2" color="white">
                          {t('minimum')}{' '}
                          <span data-testid="module-duration">
                            {formatDurationShort(
                              selectedGroup.duration.aggregate?.sum?.duration ??
                                0
                            )}
                          </span>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </StyledAccordionSummary>

                <StyledAccordionDetails
                  sx={{
                    borderColor: getModuleCardColor(selectedGroup.color),
                  }}
                >
                  <Stack spacing={1}>
                    {selectedGroup.modules.map((module, index) => (
                      <Box key={index} sx={{ mt: 2 }}>
                        <Typography key={module.id}>{module.name}</Typography>
                        {module.submodules?.length > 0 &&
                          module.submodules.map(m => (
                            <Box key={m.name} sx={{ ml: 4 }}>
                              <Typography>{m.name}</Typography>
                            </Box>
                          ))}
                      </Box>
                    ))}
                  </Stack>
                </StyledAccordionDetails>
              </Accordion>
            )
          })}
        </Box>

        <Box>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}
            disabled={
              !selectedIds.length ||
              (level === Course_Level_Enum.Level_2 &&
                !selectedIds.some(id => purpleModuleIds?.includes(id)))
            }
            onClick={submitButtonHandler}
            data-testid="submit-button"
          >
            {t('submit')}
          </LoadingButton>
          <Button
            variant="outlined"
            fullWidth
            size="medium"
            disabled={!selectedIds.length}
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

export default memo(GroupsSelection)
