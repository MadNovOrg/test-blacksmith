import { Box } from '@mui/material'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { Course_Status_Enum } from '@app/generated/graphql'

import { CourseStatusChip } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

import '@app/i18n/config'

export default {
  title: 'components/CourseStatusChip',
  component: CourseStatusChip,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof CourseStatusChip>

const ChipContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => <Box mb={2}>{children}</Box>

export const AllStatuses = () => (
  <>
    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.ConfirmModules} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.EvaluationMissing} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.GradeMissing} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.TrainerPending} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.TrainerDeclined} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.TrainerMissing} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.Cancelled} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.Declined} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.Completed} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.Draft} />
    </ChipContainer>

    <ChipContainer>
      <CourseStatusChip status={Course_Status_Enum.Scheduled} />
    </ChipContainer>
  </>
)
