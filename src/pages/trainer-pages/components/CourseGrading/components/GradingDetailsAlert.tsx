import { Box, Typography, styled } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import { PropsWithChildren } from 'react'

import { Accreditors_Enum, Course } from '@app/generated/graphql'
import theme from '@app/theme'

type Props = {
  course: Pick<Course, 'accreditedBy'>
}

const StyledList = styled('ol')(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  color: theme.palette.secondary.main,
}))

const StyledText = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: theme.palette.secondary.main,
}))

export const GradingDetailsAlert: React.FC<PropsWithChildren<Props>> = ({
  course,
  children,
}) => {
  return (
    <Box
      maxWidth="sm"
      sx={{
        borderRadius: 1,
        backgroundColor: theme.colors.navy[50],
        padding: 3,
      }}
    >
      <StyledText variant="body1" fontWeight="600">
        {t(
          'pages.course-details.tabs.grading.grading-details-confirmation.line1'
        ) + ' '}
      </StyledText>
      <StyledText variant="body1">
        {t(
          'pages.course-details.tabs.grading.grading-details-confirmation.line2'
        )}
      </StyledText>
      <StyledList>
        <Box sx={{ my: 2 }}>
          <li>
            <StyledText variant="body1" fontWeight="600">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.line3'
              ) + ' '}
            </StyledText>
            <StyledText variant="body1">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.line4'
              ) + ' '}
            </StyledText>
            <StyledList type="a">
              <li>
                <StyledText variant="body1">
                  {t(
                    'pages.course-details.tabs.grading.grading-details-confirmation.line5'
                  )}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t(
                    'pages.course-details.tabs.grading.grading-details-confirmation.line6'
                  )}
                </StyledText>
              </li>
              <li>
                <StyledText variant="body1">
                  {t(
                    'pages.course-details.tabs.grading.grading-details-confirmation.line7'
                  )}
                </StyledText>
              </li>
            </StyledList>
          </li>
        </Box>
        {course.accreditedBy === Accreditors_Enum.Icm ? (
          <li>
            <StyledText variant="body1" fontWeight="600">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.line8'
              ) + ' '}
            </StyledText>
            <StyledText variant="body1">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.line9'
              ) + ' '}
            </StyledText>
          </li>
        ) : null}
      </StyledList>

      {children}
    </Box>
  )
}
