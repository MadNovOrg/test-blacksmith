import React, { useEffect } from 'react'

import { useAuth } from '@app/context/auth'
import { RoleName } from '@app/types'

type Props = {
  role: RoleName
}

export const ChangeRole: React.FC<React.PropsWithChildren<Props>> = ({
  role,
}) => {
  const { changeRole } = useAuth()

  useEffect(() => {
    changeRole(role)
  }, [changeRole, role])

  return null
}
