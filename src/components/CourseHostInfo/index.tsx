import { ListItemText } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Type_Enum } from '@app/generated/graphql'
import { Organization } from '@app/types'

interface Props {
  courseType: Course_Type_Enum
  organization: Organization
}

export const CourseHostInfo: React.FC<React.PropsWithChildren<Props>> = ({
  courseType,
  organization,
}) => {
  const { t } = useTranslation()

  const showOrganizationName = useMemo(
    () => courseType !== Course_Type_Enum.Open,
    [courseType]
  )

  return (
    <ListItemText>
      {showOrganizationName
        ? t('pages.course-participants.company-host', {
            companyName: `${
              organization.name ||
              t('pages.course-participants.missing-company-name')
            }`,
          })
        : t('pages.course-participants.team-Teach-host')}
    </ListItemText>
  )
}
