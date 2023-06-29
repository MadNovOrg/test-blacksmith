import { Circle } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionSummary,
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { Course, Module } from '@app/types'

type Props = {
  course: Course
}

export const BILDOverview: React.FC<React.PropsWithChildren<Props>> = ({
  course,
}: Props) => {
  const { t } = useTranslation()
  const {
    strategies: bildStrategies,
    error: modulesLoadingError,
    isLoading: modulesLoading,
  } = useBildStrategies(true)

  const modulesSelection = useMemo(() => {
    if (!course.bildModules) {
      return
    }

    return bildStrategies
      .map(strategy => {
        const activeStrategy = (course.bildModules || []).map(
          item => item.modules[strategy.name]
        )

        return {
          ...strategy,
          modules: {
            ...strategy.modules,
            groups: strategy.modules.groups?.map(group => ({
              ...group,
              modules: group.modules.map(module => ({
                ...module,
                checked: activeStrategy.some(item =>
                  item?.groups.some(
                    ({ modules: groupModules }: { modules: Module[] }) =>
                      groupModules.some(
                        ({ name }: Module) => name === module.name
                      )
                  )
                ),
              })),
            })),
            modules: strategy.modules.modules?.map(module => ({
              ...module,
              checked: activeStrategy.some(item =>
                item?.modules.some(({ name }: Module) => name === module.name)
              ),
            })),
          },
        }
      })
      .map(strategy => ({
        ...strategy,
        modules: {
          ...strategy.modules,
          groups: strategy.modules.groups?.map(group => ({
            ...group,
            checked: !group.modules.some(({ checked }) => !checked),
            indeterminate: group.modules.some(({ checked }) => checked),
          })),
        },
      }))
      .map(strategy => ({
        ...strategy,
        checked:
          !strategy.modules.modules?.some(({ checked }) => !checked) &&
          !strategy.modules.groups?.some(({ checked }) => !checked),
        indeterminate:
          strategy.modules.modules?.some(({ checked }) => checked) ||
          strategy.modules.groups?.some(
            ({ checked, indeterminate }) => checked || indeterminate
          ),
      }))
  }, [course, bildStrategies])

  return (
    <>
      {modulesLoading && (
        <Alert severity="error" variant="filled">
          {t('internal-error')}
        </Alert>
      )}
      {modulesLoadingError && (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      )}

      {modulesSelection?.map(strategy => (
        <Accordion key={strategy.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={strategy.checked}
                indeterminate={!strategy.checked && strategy.indeterminate}
                disabled
              />
              <Typography variant="body1" ml={1}>
                {t(`common.bild-strategies.${strategy.name}`)}
              </Typography>

              {strategy.indeterminate && (
                <Circle
                  color="primary"
                  sx={{
                    ml: 1,
                    fontSize: 8,
                  }}
                />
              )}
            </Box>
          </AccordionSummary>

          <Box ml={4}>
            {!!strategy.modules.modules?.length && (
              <Box>
                {strategy.modules.modules.map(module => (
                  <Box key={module.name} ml={4} mb={2}>
                    <Box display="flex" alignItems="center">
                      <Checkbox checked={module.checked} disabled />
                      <Typography variant="body1" ml={1}>
                        {module.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {strategy.modules.groups?.map(group => (
              <Accordion key={group.name}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={group.checked}
                      indeterminate={!group.checked && group.indeterminate}
                      disabled
                    />
                    <Typography variant="body1" ml={1}>
                      {group.name}
                    </Typography>

                    {group.indeterminate && (
                      <Circle
                        color="primary"
                        sx={{
                          ml: 1,
                          fontSize: 8,
                        }}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                {!!group.modules.length && (
                  <Box ml={4}>
                    {group.modules.map(module => (
                      <Box key={module.name} ml={4} my={2}>
                        <Box display="flex" alignItems="center">
                          <Checkbox checked={module.checked} disabled />
                          <Typography variant="body1" ml={1}>
                            {module.name}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Accordion>
            ))}
          </Box>
        </Accordion>
      ))}
    </>
  )
}
