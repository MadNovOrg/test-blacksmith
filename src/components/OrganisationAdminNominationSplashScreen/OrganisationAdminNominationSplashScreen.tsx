import { Link } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { useProfileOrgAdminNominationSplashScreen } from '@app/hooks/useProfileOrgAdminNominationSplashScreen/useProfileOrgAdminNominationSplashScreen'

import { Dialog } from '../dialogs/Dialog'

export const isNotTargetPage = (pathname: string) => {
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

  return false
}

export const OrganisationAdminNominationSplashScreen = () => {
  const hasDialogOpened = useRef<boolean>(false)

  const location = useLocation()
  const pathname = location.pathname

  const { t } = useTranslation()

  const [open, setOpen] = useState(true)

  const {
    isOrgAdminNominationSplashScreenEnabled,
    insertSubmissionOfOrgAdminNominationSplashScreen,
  } = useProfileOrgAdminNominationSplashScreen()

  useEffect(() => {
    if (open && !hasDialogOpened.current) {
      hasDialogOpened.current = true
    }
  }, [open])

  useEffect(() => {
    if (!open && hasDialogOpened.current) {
      insertSubmissionOfOrgAdminNominationSplashScreen()
    }
  }, [insertSubmissionOfOrgAdminNominationSplashScreen, open])

  if (!isOrgAdminNominationSplashScreenEnabled || isNotTargetPage(pathname)) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        setOpen(false)
      }}
      slots={{
        Title: () => (
          <Typography
            variant="h3"
            fontWeight={600}
            color="secondary"
            gutterBottom
          >
            {t('components.organisation-admin-nomination-splash-screen.title')}
          </Typography>
        ),
      }}
    >
      <Typography variant="body1" paragraph>
        <Trans
          i18nKey={
            'components.organisation-admin-nomination-splash-screen.body'
          }
          components={{
            linkToNominate: (
              <Link
                onClick={() => {
                  setOpen(false)
                }}
                color="blue"
                href={import.meta.env.VITE_ORG_ADMIN_NOMINATION_URL}
                target="_blank"
                rel="noopener"
              />
            ),
          }}
        />
      </Typography>
    </Dialog>
  )
}
