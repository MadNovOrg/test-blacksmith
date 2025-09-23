import { Box, Link, List, ListItem, Typography, Divider } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Dialog } from '@app/components/dialogs'
import { useProfileInsightsReportSplashScreen } from '@app/hooks/useProfileInsightsReportSplashScreen/useProfileInsightsReportSplashScreen'

export const isNotTargetPage = (pathname: string) => {
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const cleanPath = pathname.replace(/\/$/, '')
  const pathParts = cleanPath.split('/').filter(Boolean)

  if (
    pathParts.length === 1 &&
    [
      'accept-invite',
      'accept-org-invite',
      'auto-login',
      'invitation',
      'login',
      'onboarding',
      'org-invitation',
      'registration',
      'verify',
    ].includes(pathParts[0])
  ) {
    return true
  }

  if (pathParts.length === 1 && pathParts[0] === 'organisations') {
    return true
  }

  if (
    pathParts.length === 2 &&
    pathParts[0] === 'organisations' &&
    UUID_REGEX.test(pathParts[1])
  ) {
    return true
  }

  return false
}

export const InsightsReportSplashScreen = () => {
  const location = useLocation()
  const pathname = location.pathname

  const { t } = useTranslation()
  const { managedOrgsWithDashboardUrls } =
    useProfileInsightsReportSplashScreen()

  if (
    !managedOrgsWithDashboardUrls.length ||
    (isNotTargetPage(pathname) &&
      managedOrgsWithDashboardUrls.some(org =>
        pathname.endsWith(`/${org.orgId}`),
      ))
  ) {
    return null
  }

  const titleKey =
    managedOrgsWithDashboardUrls.length === 1
      ? 'components.insights-report-splash-screen.one-managed-org-title'
      : 'components.insights-report-splash-screen.multiple-managed-orgs-title'

  const bodyKey =
    managedOrgsWithDashboardUrls.length === 1
      ? 'components.insights-report-splash-screen.one-managed-org-body'
      : 'components.insights-report-splash-screen.multiple-managed-orgs-body'

  const subtitleKey =
    managedOrgsWithDashboardUrls.length === 1
      ? 'components.insights-report-splash-screen.one-managed-org-subtitle'
      : 'components.insights-report-splash-screen.multiple-managed-orgs-subtitle'

  return (
    <Dialog
      open
      onClose={() => {
        return
      }}
      showClose={false}
      slots={{
        Title: () => (
          <Typography
            variant="h3"
            fontWeight={600}
            color="secondary"
            gutterBottom
          >
            {t(titleKey)}
          </Typography>
        ),
      }}
    >
      <Typography variant="body1" paragraph>
        <Trans i18nKey={bodyKey} />
      </Typography>

      <Box
        sx={{
          maxHeight: 250,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          mb: 2,
        }}
      >
        <List disablePadding>
          {managedOrgsWithDashboardUrls.map((org, index) => (
            <Box key={org.orgId}>
              <ListItem sx={{ px: 0 }}>
                <Link href={`/organisations/${org.orgId}`} underline="hover">
                  {org.name}
                </Link>
              </ListItem>
              {index < managedOrgsWithDashboardUrls.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>

      <Typography variant="body2">
        <Trans i18nKey={subtitleKey} />
      </Typography>
    </Dialog>
  )
}
