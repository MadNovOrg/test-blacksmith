import { Box, Typography, styled } from '@mui/material'
import { t } from 'i18next'
import React, { PropsWithChildren } from 'react'

import {
  Accreditors_Enum,
  Course,
  Course_Type_Enum,
} from '@app/generated/graphql'
import theme from '@app/theme'

type Props = {
  course: Pick<Course, 'accreditedBy' | 'type'>
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
  const isOpenCourse = course.type === Course_Type_Enum.Open
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
          'pages.course-details.tabs.grading.grading-details-confirmation.description',
        )}
      </StyledText>
      {!isOpenCourse ? (
        <StyledText variant="body1" fontWeight="600">
          <br />
          <br />
          {t(
            'pages.course-details.tabs.grading.grading-details-confirmation.block-course-overivew-changes-info',
          )}
        </StyledText>
      ) : null}
      <StyledList>
        <li>
          <StyledText variant="body1" fontWeight="500">
            {t(
              'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grading-criteria',
            )}
          </StyledText>
        </li>
        {course.accreditedBy === Accreditors_Enum.Icm ? (
          <li>
            <StyledText variant="body1" fontWeight="500">
              {t(
                'pages.course-details.tabs.grading.grading-details-confirmation.confirm-modules-and-techniques',
              )}
            </StyledText>
          </li>
        ) : null}
      </StyledList>
      <StyledText variant="body1" fontWeight="500">
        {t(
          `pages.course-details.tabs.grading.grading-details-confirmation.${
            isOpenCourse
              ? 'please-note-warning-open-courses'
              : 'please-note-warning-closed-indirect-courses'
          }`,
        )}
      </StyledText>
      {children}
    </Box>
  )
}
