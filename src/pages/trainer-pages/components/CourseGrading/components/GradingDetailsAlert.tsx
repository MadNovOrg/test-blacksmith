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
          'pages.course-details.tabs.grading.grading-details-confirmation.description'
        )}
      </StyledText>
      <StyledList>
        <li>
          <StyledText variant="body1" fontWeight="500">
            {t(
              'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grading-criteria'
            )}
          </StyledText>
        </li>
        {course.accreditedBy === Accreditors_Enum.Icm ? (
          <li>
            <StyledText variant="body1" fontWeight="500">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.confirm-modules-and-techniques'
              )}
            </StyledText>
          </li>
        ) : null}
      </StyledList>
      <StyledText variant="body1" fontWeight="500">
        {t(
          'pages.course-details.tabs.grading.grading-details-confirmation.please-note-warning'
        )}
      </StyledText>
      {children}
    </Box>
  )
}
