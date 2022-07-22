import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { StyledSubNavLink } from '@app/components/StyledSubNavLink'
import { useAuth } from '@app/context/auth'

type AdminPageProps = unknown

export const AdminPage: React.FC<AdminPageProps> = () => {
  const { acl } = useAuth()

  const tabs = [
    {
      id: '/admin/contacts',
      title: 'Contacts',
    },
    ...(acl.canViewXeroConnect()
      ? [{ id: '/admin/xero/connect', title: 'Xero Connect' }]
      : []),
  ]

  return (
    <>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Box
          flex={1}
          height={44}
          lineHeight={2}
          display="flex"
          justifyContent="left"
          px={3}
          color="secondary.dark"
        >
          {tabs.map(t => (
            <Link key={t.id} component={StyledSubNavLink} to={t.id}>
              {t.title}
            </Link>
          ))}
        </Box>
      </Toolbar>

      <Outlet />
    </>
  )
}
