import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

type AdminPageProps = unknown

const StyledSubNavLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),

  '&.active': {
    fontWeight: '600',
    backgroundColor: theme.palette.grey[100],
  },
}))

export const AdminPage: React.FC<AdminPageProps> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const tabs = [
    {
      id: '/admin/contacts',
      title: 'Contacts',
    },
    {
      id: '/admin/organizations',
      title: t('common.organizations'),
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
          mb: 2,
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
