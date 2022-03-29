import { useMemo } from 'react'

import { useAuth } from '@app/context/auth'
export const useMainNavTabs = () => {
  const { acl } = useAuth()

  return useMemo(() => {
    return [
      {
        id: '/my-training',
        title: 'My Training',
        show: acl.canViewMyTraining(),
      },
      {
        id: '/trainer-base',
        title: 'Trainer Base',
        show: acl.canViewTrainerBase(),
      },
      {
        id: '/my-organization',
        title: 'My Organization',
        show: acl.canViewMyOrganization(),
      },
      {
        id: '/membership-area',
        title: 'Membership Area',
        show: acl.canViewMembership(),
      },
      {
        id: '/admin',
        title: 'Admin',
        show: acl.canViewAdmin(),
      },
    ].filter(t => t.show)
  }, [acl])
}
