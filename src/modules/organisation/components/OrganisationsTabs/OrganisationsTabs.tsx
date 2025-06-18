import { Box, Container, Link, Toolbar } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

export const OrganisationsTabs = ({ activeTab }: { activeTab: 0 | 1 }) => {
  const { acl } = useAuth()

  const { t } = useTranslation()

  const tabs = useMemo(() => {
    return [
      {
        label: t('pages.admin.organizations.title'),
        href: '/organisations/list',
      },
      {
        label: t('pages.admin.organisations-merge-logs.title'),
        href: '/organisations/merge-logs',
      },
    ]
  }, [t])

  if (!acl.isAdmin()) return null

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Toolbar disableGutters sx={{ minHeight: '0px !important', paddingY: 0 }}>
        <Box display="flex" justifyContent="flex-start" gap={3} width="100%">
          {tabs.map((tab, index) => (
            <Box
              alignItems="center"
              borderBottom={activeTab === index ? 1 : 0}
              color={activeTab !== index ? 'grey' : 'secondary.dark'}
              display="flex"
              height={44}
              justifyContent="left"
              key={tab.label}
              lineHeight={2}
              overflow="hidden"
            >
              <Link href={tab.href} underline="none">
                {tab.label}
              </Link>
            </Box>
          ))}
        </Box>
      </Toolbar>
    </Container>
  )
}
