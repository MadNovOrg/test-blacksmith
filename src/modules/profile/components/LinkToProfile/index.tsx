import Link from '@mui/material/Link'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

type Props = {
  profileId: string
  isProfileArchived?: boolean | null
  courseId?: string | number
}

export const LinkToProfile: React.FC<React.PropsWithChildren<Props>> = ({
  profileId,
  isProfileArchived,
  courseId,
  children,
}) => {
  const { acl } = useAuth()
  const navigate = useNavigate()

  const handleNavigateToProfile = () => {
    navigate(`/profile/${profileId}`, {
      replace: false,
      state: { courseId },
    })
  }

  const link = (
    <button
      style={{ all: 'unset' }}
      onClick={handleNavigateToProfile}
      data-testid="link-to-user-profile"
    >
      <Link>{children}</Link>
    </button>
  )
  const noLink = <div data-testid="no-link-generated">{children}</div>

  if (isProfileArchived) {
    return acl.canViewArchivedProfileData() && acl.canViewProfiles()
      ? link
      : noLink
  } else {
    return acl.canViewProfiles() ? link : noLink
  }
}
