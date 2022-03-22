import { useMemo } from 'react'

import { useAuth } from '@app/context/auth'
export const useMainNavTabs = () => {
  const { acl } = useAuth()

  return useMemo(() => {
    return [
      {
        id: '/trainer-base',
        title: 'Trainer Base',
        show: acl.canViewTrainerBase(),
      },
      {
        id: '/my-training',
        title: 'My Training',
        show: true,
      },
      {
        id: '/my-organization',
        title: 'My Organization',
        show: true,
      },
      {
        id: '/admin',
        title: 'Admin',
        show: acl.isAdmin(),
      },
      {
        id: '/membership-area',
        title: 'Membership Area',
        show: true,
      },
    ].filter(t => t.show)
  }, [acl])
}
