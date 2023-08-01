import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
} from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Type_Enum } from '@app/generated/graphql'
import { BildStrategies } from '@app/types'

import { Strategy } from '../../types'

type Props = {
  strategyModules: Record<string, Partial<Strategy>> // all optional since it's from jsonb field
  onChange: (selection: Record<string, Strategy>) => void
  courseType: Course_Type_Enum
}
export const BILDModulesSelection: FC<Props> = ({
  strategyModules,
  onChange,
  courseType,
}) => {
  const { t } = useTranslation()
  const mandatoryStrategies: string[] =
    courseType === Course_Type_Enum.Open
      ? [BildStrategies.Primary, BildStrategies.Secondary]
      : Object.values(BildStrategies)

  const [selectedStrategyModules, setSelectedStrategyModules] = useState<
    Set<string>
  >(reverseTransformSelection(strategyModules))

  const selectStrategy = (strategyName: string) => {
    const strategySelection = new Set<string>([strategyName])

    const strategy = strategyModules[strategyName]

    strategy.modules?.forEach(module => {
      strategySelection.add(
        getModuleKey({ strategyName, moduleName: module.name })
      )
    })

    strategy.groups?.forEach(group => {
      group.modules.forEach(module => {
        strategySelection.add(
          getModuleKey({
            strategyName,
            groupName: group.name,
            moduleName: module.name,
          })
        )
      })
    })

    setSelectedStrategyModules(prev => {
      return new Set([...prev, ...strategySelection])
    })
  }

  const unselectStrategy = (strategyName: string) => {
    setSelectedStrategyModules(prev => {
      const newValue = new Set(prev)

      newValue.forEach(key => {
        if (key.includes(strategyName)) {
          newValue.delete(key)
        }
      })

      return newValue
    })
  }

  const selectModule = (key: string) => {
    setSelectedStrategyModules(prev => {
      const newValue = new Set(prev)
      newValue.add(key)

      return newValue
    })
  }

  const unselectModule = (key: string) => {
    setSelectedStrategyModules(prev => {
      const newValue = new Set(prev)
      newValue.delete(key)

      return newValue
    })
  }

  useEffect(() => {
    onChange(transformSelection(selectedStrategyModules))
  }, [onChange, selectedStrategyModules])

  const partiallySelectedStrategies = useMemo(() => {
    const strategies = new Set<string>([])

    Object.keys(strategyModules).forEach(strategyName => {
      let modulesCount = strategyModules[strategyName].modules?.length ?? 0

      strategyModules[strategyName].groups?.forEach(group => {
        modulesCount += group.modules.length
      })

      const strategySelectionCount = Array.from(selectedStrategyModules).filter(
        key => key.includes(strategyName) && key !== strategyName
      ).length

      if (strategySelectionCount > 0 && strategySelectionCount < modulesCount) {
        strategies.add(strategyName)
      }
    })

    return strategies
  }, [selectedStrategyModules, strategyModules])

  if (!Object.keys(strategyModules).length) {
    return (
      <Alert severity="warning" variant="outlined">
        {t('pages.course-grading.no-modules')}
      </Alert>
    )
  }

  return (
    <>
      {Object.keys(strategyModules).map(strategyName => (
        <Accordion
          key={strategyName}
          disableGutters
          sx={{ marginBottom: 1 }}
          data-testid={`strategy-accordion-${strategyName}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <FormControlLabel
              onClick={e => e.stopPropagation()}
              control={
                <Checkbox
                  checked={Boolean(selectedStrategyModules.has(strategyName))}
                  disabled={mandatoryStrategies.includes(strategyName)}
                  indeterminate={partiallySelectedStrategies.has(strategyName)}
                  onChange={(_, checked) => {
                    if (
                      checked ||
                      partiallySelectedStrategies.has(strategyName)
                    ) {
                      selectStrategy(strategyName)
                    } else {
                      unselectStrategy(strategyName)
                    }
                  }}
                  inputProps={{
                    // @ts-expect-error valid custom attribute
                    'data-testid': `strategy-checkbox-${strategyName}`,
                  }}
                />
              }
              label={
                <Typography>
                  {t(`common.bild-strategies.${strategyName}`)}
                </Typography>
              }
            />
          </AccordionSummary>

          <AccordionDetails sx={{ paddingLeft: 6 }}>
            {strategyModules[strategyName].modules?.length
              ? strategyModules[strategyName].modules?.map((module, index) => {
                  const moduleKey = getModuleKey({
                    strategyName,
                    moduleName: module.name,
                  })

                  return (
                    <FormGroup key={index} sx={{ marginBottom: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedStrategyModules.has(moduleKey)}
                            onChange={(_, checked) => {
                              if (checked) {
                                selectModule(moduleKey)
                              } else {
                                unselectModule(moduleKey)
                              }
                            }}
                            disabled={
                              mandatoryStrategies.includes(strategyName) ||
                              module.mandatory
                            }
                          />
                        }
                        label={<Typography>{module.name}</Typography>}
                      />
                    </FormGroup>
                  )
                })
              : null}

            {strategyModules[strategyName].groups?.length
              ? strategyModules[strategyName].groups?.map(group => (
                  <Box key={group.name}>
                    <Typography fontWeight="500" mb={2}>
                      {group.name}
                    </Typography>

                    {group.modules?.length
                      ? group.modules.map(module => {
                          const moduleKey = getModuleKey({
                            strategyName,
                            groupName: group.name,
                            moduleName: module.name,
                          })

                          return (
                            <FormGroup key={moduleKey} sx={{ marginBottom: 2 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(_, checked) => {
                                      if (checked) {
                                        selectModule(moduleKey)
                                      } else {
                                        unselectModule(moduleKey)
                                      }
                                    }}
                                    checked={Boolean(
                                      selectedStrategyModules.has(moduleKey)
                                    )}
                                    disabled={
                                      mandatoryStrategies.includes(
                                        strategyName
                                      ) || module.mandatory
                                    }
                                  />
                                }
                                label={<Typography>{module.name}</Typography>}
                              />
                            </FormGroup>
                          )
                        })
                      : null}
                  </Box>
                ))
              : null}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}

function transformSelection(selected: Set<string>): Record<string, Strategy> {
  const transformedSelection: Record<string, Strategy> = {}

  selected.forEach(selection => {
    const [strategyName, ...parts] = selection.split('/')

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
  })

  return transformedSelection
}

function reverseTransformSelection(
  strategyModules: Record<string, Partial<Strategy>>
): Set<string> {
  const selection = new Set<string>([])

  Object.keys(strategyModules).forEach(strategyName => {
    selection.add(strategyName)

    strategyModules[strategyName].modules?.forEach(module => {
      selection.add(getModuleKey({ strategyName, moduleName: module.name }))
    })

    strategyModules[strategyName].groups?.forEach(group => {
      group.modules.forEach(module => {
        selection.add(
          getModuleKey({
            strategyName,
            groupName: group.name,
            moduleName: module.name,
          })
        )
      })
    })
  })

  return selection
}

function getModuleKey({
  strategyName,
  groupName,
  moduleName,
}: {
  strategyName: string
  groupName?: string
  moduleName: string
}): string {
  return [strategyName, groupName, moduleName].filter(Boolean).join('/')
}
