import { Box, Link, List, ListItem, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { FullHeightPage } from '@app/components/FullHeightPage'
import { Tile } from '@app/components/Tile'
import { useAuth } from '@app/context/auth'
import theme from '@app/theme'

type AdminPageProps = unknown

export const AdminPage: React.FC<
  React.PropsWithChildren<AdminPageProps>
> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const hubSettings = useMemo(() => {
    const hubSettings = [
      { name: 'users', link: '/admin/users' },
      { name: 'organisations', link: '/organisations/list' },
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
    <FullHeightPage
      bgcolor={theme.palette.grey[100]}
      pb={3}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Box sx={{ width: '80%', maxWidth: '628px' }}>
        <Typography variant="h1" pt={3} pb={2} fontWeight={600}>
          {t(`pages.admin.hub-settings.title`)}
        </Typography>
        <List>
          {hubSettings.map(({ name, link }) => (
            <ListItem sx={{ padding: 0, marginBottom: 2 }} key={name}>
              <Link href={link} sx={{ width: '100%' }}>
                <Tile sx={{ display: 'block' }}>
                  <Typography variant="subtitle2" mb={1}>
                    {t(`pages.admin.hub-settings.${name}.title`)}
                  </Typography>
                  <Typography variant="body1">
                    {t(`pages.admin.hub-settings.${name}.description`)}
                  </Typography>
                </Tile>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </FullHeightPage>
  )
}
