import { TableRow, TableCell, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import {
  Course_Trainer_Type_Enum,
  Course_Status_Enum,
} from '@app/generated/graphql'
import { CourseTrainerType } from '@app/types'

import { PROFILE_TABLE_ROW_SX } from '../../utils/common'

export const trainerTypeLabelMap: Record<CourseTrainerType, string> = {
  [Course_Trainer_Type_Enum.Assistant]: 'assist-trainer',
  [Course_Trainer_Type_Enum.Leader]: 'lead-trainer',
  [Course_Trainer_Type_Enum.Moderator]: 'moderator',
}

interface Props {
  courseId: number
  courseCode: string
  courseStatus?: Course_Status_Enum | null
  courseStartDate?: string
  trainingLevel: Course_Trainer_Type_Enum
}

export const CourseTrainerRow = ({
  courseId,
  courseCode,
  courseStatus,
  trainingLevel,
  courseStartDate,
}: Props) => {
  const { t } = useTranslation()

  return (
    <TableRow sx={PROFILE_TABLE_ROW_SX}>
      <TableCell>
        <Link href={`/courses/${courseId}/details`}>{courseCode}</Link>
      </TableCell>
      <TableCell data-testid="trainer-level">
        {t(
          `components.trainer-avatar-group.${trainerTypeLabelMap[trainingLevel]}`
        )}
      </TableCell>
      <TableCell>
        <CourseStatusChip status={courseStatus as Course_Status_Enum} />
      </TableCell>
      <TableCell>
        {t('dates.defaultShort', {
          date: courseStartDate,
        })}
      </TableCell>
    </TableRow>
  )
}
