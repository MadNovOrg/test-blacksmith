import CheckedAllIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import UncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { LoadingButton } from '@mui/lab'
import {
  Grid,
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
import { usePrevious } from 'react-use'

import { Color_Enum, ModuleGroupsQuery } from '@app/generated/graphql'
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
  showDuration = true,
  maxDuration = 0,
  slots,
  onSubmit,
  onChange,
}) => {
  const theme = useTheme()

  const [selectedIds, setSelectedIds] = useState<string[]>(
    !initialGroups.length
      ? mandatoryGroups.map(group => group.id)
      : initialGroups.map(group => group.id)
  )

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

  const handleGroupClick = (groupId: string) => {
    const selectedIdsSet = new Set(selectedIds)

    if (selectedIdsSet.has(groupId)) {
      selectedIdsSet.delete(groupId)
    } else {
      selectedIdsSet.add(groupId)
    }

    setSelectedIds(Array.from(selectedIdsSet))
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
    <Box borderTop={1} mt={4} borderColor="grey.200">
      <Grid container spacing={4}>
        <Grid item md={6} xs={12} data-testid="available-modules">
          <Box pt={4}>
            <Typography variant="h3" mb={4}>
              {t(
                'pages.trainer-base.create-course.new-course.modules-available'
              )}
            </Typography>

            {availableGroups.map(moduleGroup => {
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
                        selectedIds.includes(moduleGroup.id) ||
                        moduleGroup.mandatory
                          ? 0.6
                          : 1,
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        disabled={mandatoryGroups.includes(moduleGroup)}
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
                              {moduleGroup.mandatory ? <span> *</span> : null}
                            </Typography>
                            {moduleGroup.duration.aggregate?.sum?.duration && (
                              <Typography variant="body2" color="white">
                                {t('minimum')}{' '}
                                <span data-testid="module-duration">
                                  {formatDurationShort(
                                    moduleGroup.duration.aggregate?.sum
                                      ?.duration ?? 0
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
                      {moduleGroup.modules.map(module => (
                        <Typography key={module.id}>{module.name}</Typography>
                      ))}
                    </Stack>
                  </StyledAccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Grid>
        <Grid item md={6} xs={12} data-testid="selected-modules">
          {showDuration ? (
            <LinearProgress
              variant="determinate"
              value={progressPercentage > 100 ? 100 : progressPercentage}
            />
          ) : null}

          <Box
            pl={{ md: 4, sx: 0 }}
            pt={4}
            boxShadow={{
              md: '-7px 0px 10px -11px rgba(184,184,184,1)',
              sx: 'none',
            }}
            minHeight={300}
          >
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
                  <Typography
                    variant="h6"
                    px={1}
                    data-testid="progress-bar-label"
                  >
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
                        backgroundColor: getModuleCardColor(
                          selectedGroup.color
                        ),
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <CheckedAllIcon color="inherit" />

                        <Box ml={1.5}>
                          <Typography data-testid="module-name">
                            <span>{selectedGroup.name}</span>
                            <span>
                              {selectedGroup.mandatory ? <span> *</span> : null}
                            </span>
                          </Typography>
                          {selectedGroup.duration.aggregate?.sum?.duration && (
                            <Typography variant="body2" color="white">
                              {t('minimum')}{' '}
                              <span data-testid="module-duration">
                                {formatDurationShort(
                                  selectedGroup.duration.aggregate?.sum
                                    ?.duration ?? 0
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
                        {selectedGroup.modules.map(module => (
                          <Typography key={module.id}>{module.name}</Typography>
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
                disabled={!selectedIds.length}
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(GroupsSelection)
