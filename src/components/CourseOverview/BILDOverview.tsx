import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Course } from '@app/types'

type Props = {
  course: Course
}

export const BILDOverview: React.FC<React.PropsWithChildren<Props>> = ({
  course,
}: Props) => {
  const { t } = useTranslation()

  if (!course.bildModules?.length) {
    return null
  }

  const { modules } = course.bildModules[0]
  const strategies = course.bildStrategies

  return (
    <>
      {strategies.map(({ strategyName }) => {
        const numberOfModules: number =
          modules[strategyName].modules?.length ?? 0

        const numberOfGroupModules: number = modules[strategyName].groups
          ?.length
          ? modules[strategyName].groups.reduce(
              (acc: number, group: { modules: [{ name: string }] }) => {
                return acc + group.modules.length
              },
              0
            )
          : 0

        const modulesCount = numberOfGroupModules + numberOfModules

        return (
          <Accordion key={strategyName} disableGutters>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ width: { sm: '100%', md: '75%', lg: '50%' } }}
            >
              <Box display="flex" alignItems="center">
                <Checkbox
                  defaultChecked={true}
                  disabled={true}
                  sx={{ marginRight: 2 }}
                />
                <Typography variant="body1">
                  {t(`bild-strategies.${strategyName}`)}
                </Typography>
                <Typography variant="body2" ml={1}>
                  {t('areas', { count: modulesCount })}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ ml: 1 }}>
              {modules[strategyName].modules?.length
                ? modules[strategyName].modules.map(
                    (module: { name: string }, index: number) => (
                      <Typography mb={2} key={index}>
                        {module.name}
                      </Typography>
                    )
                  )
                : null}

              {modules[strategyName].groups?.length
                ? modules[strategyName].groups.map(
                    (group: { name: string; modules: [{ name: string }] }) => (
                      <Box key={group.name}>
                        <Typography fontWeight="500" mb={2}>
                          {group.name}
                        </Typography>

                        {group.modules?.length
                          ? group.modules.map((module, index) => (
                              <Typography key={index} mb={2} ml={1}>
                                {module.name}
                              </Typography>
                            ))
                          : null}
                      </Box>
                    )
                  )
                : null}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}
