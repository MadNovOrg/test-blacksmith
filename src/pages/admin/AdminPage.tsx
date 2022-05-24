import { Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RRLink, Outlet } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { useRouteMatch } from '@app/hooks/use-route-match'

type AdminPageProps = unknown

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minHeight: 40,

  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    top: 0,
    height: '1px',
  },

  '& .MuiButtonBase-root': {
    textTransform: 'none',

    '&.Mui-selected': {
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
    },
  },
}))

export const AdminPage: React.FC<AdminPageProps> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const tabs = [
    {
      id: '/admin/organizations',
      title: t('common.organizations'),
    },
    {
      id: '/admin/contacts',
      title: 'Contacts',
    },
    ...(acl.canViewXeroConnect()
      ? [{ id: '/admin/xero/connect', title: 'Xero Connect' }]
      : []),
  ]

  const routeMatch = useRouteMatch(tabs)
  const currentTab = routeMatch?.pattern?.path ?? tabs[0].id

  return (
    <>
      <Box sx={{ justifyContent: 'space-between' }} marginTop="-1px">
        <StyledTabs value={currentTab}>
          {tabs.map(t => (
            <Tab
              key={t.id}
              label={t.title}
              value={t.id}
              component={RRLink}
              to={t.id}
            />
          ))}
        </StyledTabs>
      </Box>
      <Outlet />
    </>
  )
}
