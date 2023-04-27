import Link from '@mui/material/Link'
import React from 'react'

import { useAuth } from '@app/context/auth'

type Props = {
  profileId: string
  isProfileArchived?: boolean | null
}

export const LinkToProfile: React.FC<React.PropsWithChildren<Props>> = ({
  profileId,
  isProfileArchived,
  children,
}) => {
  const { acl } = useAuth()
  const link = <Link href={`/profile/${profileId}`}>{children}</Link>
  const noLink = <>{children}</>

  if (isProfileArchived) {
    return acl.canViewArchivedProfileData() && acl.canViewProfiles()
      ? link
      : noLink
  } else {
    return acl.canViewProfiles() ? link : noLink
  }
}
