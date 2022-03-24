import { useMemo } from 'react'

import { useAuth } from '@app/context/auth'
export const useMainNavTabs = () => {
  const { acl } = useAuth()

  return useMemo(() => {
    return [
      {
        id: '/my-training',
        title: 'My Training',
        show: true,
      },
      {
        id: '/trainer-base',
        title: 'Trainer Base',
        show: acl.canViewTrainerBase(),
      },
      {
        id: '/my-organization',
        title: 'My Organization',
        show: true,
      },
      {
        id: '/membership-area',
        title: 'Membership Area',
        show: true,
      },
      {
        id: '/admin',
        title: 'Admin',
        show: acl.isAdmin(),
      },
    ].filter(t => t.show)
  }, [acl])
}
