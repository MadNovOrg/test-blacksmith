import { Box, Link, List, ListItem, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { Tile } from '@app/components/Tile'
import { useAuth } from '@app/context/auth'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'

export const AdminPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const hubSettings = useMemo(() => {
    const hubSettings = [
      { name: 'users', link: '/admin/users' },
      { name: 'organisations', link: '/organisations/list' },
      {
        name: 'course-exceptions-log',
        link: '/admin/course-exceptions-log',
      },
    ]
    if (acl.canViewAdminPricing()) {
      hubSettings.push({ name: 'course-pricing', link: '/admin/pricing' })
    }
    if (acl.canViewAdminDiscount()) {
      hubSettings.push({ name: 'discounts', link: '/admin/discounts' })
    }
    if (acl.canViewAdminCancellationsTransfersReplacements()) {
      hubSettings.push({
        name: 'cancellations-transfers-replacements',
        link: '/admin/audit',
      })
    }
    return hubSettings
  }, [acl])

  return (
    <FullHeightPageLayout
      bgcolor={theme.palette.grey[100]}
      pb={3}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Helmet>
        <title>{t('pages.browser-tab-titles.admin.title')}</title>
      </Helmet>
      <Box sx={{ width: '80%', maxWidth: '628px' }}>
        <Typography variant="h1" pt={3} pb={2} fontWeight={600}>
          {t(`pages.admin.connect-settings.title`)}
        </Typography>
        <List>
          {hubSettings.map(({ name, link }) => (
            <ListItem sx={{ padding: 0, marginBottom: 2 }} key={name}>
              <Link href={link} sx={{ width: '100%' }}>
                <Tile sx={{ display: 'block' }}>
                  <Typography variant="subtitle2" mb={1}>
                    {t(`pages.admin.connect-settings.${name}.title`)}
                  </Typography>
                  <Typography variant="body1">
                    {t(`pages.admin.connect-settings.${name}.description`)}
                  </Typography>
                </Tile>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </FullHeightPageLayout>
  )
}
