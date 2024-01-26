import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  countLessons,
  isLesson,
  isModule,
} from '@app/modules/grading/shared/utils'

export const ICMOverviewV2: React.FC<{ curriculum: unknown }> = ({
  curriculum,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {Array.isArray(curriculum) && curriculum.length
        ? curriculum.map(module => {
            if (!isModule(module)) {
              return null
            }

            const lessons = module.lessons.items

            const { numberOfLessons } = countLessons(lessons)

            return (
              <Accordion key={module.id}>
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
                    <Typography>{module.displayName ?? module.name}</Typography>
                    <Typography variant="body2" ml={1}>
                      {t('areas', {
                        count: numberOfLessons,
                      })}
                    </Typography>
                  </Box>
                </AccordionSummary>

                {Array.isArray(lessons) && lessons.length ? (
                  <AccordionDetails>
                    {lessons.map((lesson: object) => {
                      if (!isLesson(lesson)) {
                        return null
                      }

                      const childLessons = lesson.items
                      const hasChildren =
                        Array.isArray(childLessons) && childLessons.length

                      return (
                        <Box key={lesson.name} sx={{ mb: 2 }}>
                          <Typography
                            fontWeight={hasChildren ? 600 : 400}
                            mb={hasChildren ? 1 : 0}
                          >
                            {lesson.name}
                          </Typography>

                          {hasChildren ? (
                            <Stack ml={2} spacing={1}>
                              {childLessons.map((item, index) => (
                                <Typography key={index}>
                                  {item?.name}
                                </Typography>
                              ))}
                            </Stack>
                          ) : null}
                        </Box>
                      )
                    })}
                  </AccordionDetails>
                ) : null}
              </Accordion>
            )
          })
        : null}
    </>
  )
}
