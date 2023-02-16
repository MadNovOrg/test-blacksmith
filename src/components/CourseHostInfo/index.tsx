import { ListItemText } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseType, Organization } from '@app/types'

interface Props {
  courseType: CourseType
  organization: Organization
}

export const CourseHostInfo: React.FC<React.PropsWithChildren<Props>> = ({
  courseType,
  organization,
}) => {
  const { t } = useTranslation()

  const showOrganizationName = useMemo(
    () => courseType !== CourseType.OPEN,
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
