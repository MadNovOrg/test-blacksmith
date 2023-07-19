import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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

  console.log(modules)

  return (
    <>
      {Object.keys(modules).map(strategyName => {
        return (
          <Accordion key={strategyName} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {t(`bild-strategies.${strategyName}`)}
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
