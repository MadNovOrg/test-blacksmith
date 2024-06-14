import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionProps,
  Box,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'

import { ModuleSettingsQuery } from '@app/generated/graphql'
import {
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@app/modules/course/pages/CourseBuilder/components/ICMCourseBuilder/components/styled'
import theme from '@app/theme'

type ModuleSetting = ModuleSettingsQuery['moduleSettings'][0]

type Props = {
  moduleSetting: ModuleSetting
  isSelected?: boolean
  renderName?: (moduleSetting: ModuleSetting) => React.ReactNode
} & Omit<AccordionProps, 'children'>

export const ModuleAccordion: React.FC<Props> = ({
  moduleSetting,
  isSelected,
  renderName,
  ...props
}) => {
  const moduleLessons = moduleSetting.module.lessons.items

  return (
    <Accordion
      key={moduleSetting.module.id}
      disableGutters
      sx={{ mb: 2 }}
      TransitionProps={{ timeout: 0 }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        sx={{
          backgroundColor: theme.colors[moduleSetting.color][500],
          opacity: isSelected || moduleSetting.mandatory ? 0.6 : 1,
        }}
      >
        {typeof renderName === 'function'
          ? renderName(moduleSetting)
          : moduleSetting.module.name}
      </StyledAccordionSummary>

      <StyledAccordionDetails
        sx={{
          borderColor: theme.colors[moduleSetting.color][500],
        }}
      >
        <Stack spacing={1}>
          {Array.isArray(moduleLessons) &&
            moduleLessons.map((lesson, index) => {
              const childLessons = lesson.items
              const hasChildren =
                Array.isArray(childLessons) && childLessons.length

              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    fontWeight={hasChildren ? 600 : 400}
                    mb={hasChildren ? 1 : 0}
                  >
                    {lesson?.name}
                  </Typography>

                  {hasChildren ? (
                    <Stack ml={2} spacing={1}>
                      {childLessons.map((item, index) => (
                        <Typography key={index}>{item?.name}</Typography>
                      ))}
                    </Stack>
                  ) : null}
                </Box>
              )
            })}
        </Stack>
      </StyledAccordionDetails>
    </Accordion>
  )
}
