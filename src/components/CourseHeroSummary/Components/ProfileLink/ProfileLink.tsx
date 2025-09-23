import { Link } from '@mui/material'

import { useAuth } from '@app/context/auth'

export const ProfileLink: React.FC<{ profileId: string; fullName: string }> = ({
  profileId,
  fullName,
}) => {
  const { acl } = useAuth()
  if (!acl.isInternalUser()) return fullName
  return <Link href={`/profile/${profileId}`}>{`${fullName} `}</Link>
}
