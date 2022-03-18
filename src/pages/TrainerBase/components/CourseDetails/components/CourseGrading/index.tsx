import React from 'react'
import { Box, Button, Container, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Course } from '@app/types'

type CourseGradingProps = {
  course: Course
}

export const CourseGrading: React.FC<CourseGradingProps> = ({ course }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <>
      <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
        {course.gradingConfirmed ? (
          <span>TODO</span>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              maxWidth="sm"
              sx={{
                borderRadius: 1,
                backgroundColor: theme.colors.navy[50],
                padding: 3,
              }}
            >
              <Typography display="inline" variant="body2" fontWeight="600">
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.line1'
                ) + ' '}
              </Typography>
              <Typography display="inline" variant="body2">
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.line2'
                )}
              </Typography>
              <ol>
                <li>
                  <Typography display="inline" variant="body2" fontWeight="600">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line3'
                    ) + ' '}
                  </Typography>
                  <Typography display="inline" variant="body2">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line4'
                    ) + ' '}
                  </Typography>
                </li>
                <li>
                  <Typography display="inline" variant="body2" fontWeight="600">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line5'
                    ) + ' '}
                  </Typography>
                  <Typography display="inline" variant="body2">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line6'
                    ) + ' '}
                  </Typography>
                </li>
              </ol>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  navigate(`/trainer-base/course/${course.id}/grading-details`)
                }
              >
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grading-details'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  )
}
