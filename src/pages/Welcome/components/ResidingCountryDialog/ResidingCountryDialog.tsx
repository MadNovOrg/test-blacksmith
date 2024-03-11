import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'

export const ResidingCountryDialog = () => {
  const [open, setOpen] = useState(false)

  const { t } = useTranslation('pages', {
    keyPrefix: 'capture-residing-country',
  })

  const STORAGE_KEY = 'residingCountryDialogWasDisplayed'
  const navigate = useNavigate()
  const { profile } = useAuth()

  useEffect(() => {
    if (profile) {
      if (localStorage.getItem(STORAGE_KEY)) {
        setOpen(false)
      } else if (!profile.country) {
        const timeoutValue = window.location.pathname.includes('details')
          ? 5000
          : 1000
        const timeout = setTimeout(() => {
          setOpen(true)
        }, timeoutValue)
        return () => clearTimeout(timeout)
      } else {
        setOpen(false)
      }
    }
  }, [profile, setOpen])

  const handleClose = () => {
    setOpen(false)
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  const handleRedirect = () => {
    handleClose()
    navigate('/profile')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={t('title')}
      maxWidth={600}
      data-testid="profile-country-dialog"
    >
      <Grid container alignItems="flex-end" spacing={2}>
        <Grid item md={12} sm={12}>
          <Typography variant="body2">
            <Trans i18nKey="pages.capture-residing-country.description" />
          </Typography>
        </Grid>
        <Grid item md={12} sm={12}>
          <Grid container justifyContent="flex-end">
            <Button
              onClick={handleRedirect}
              data-testid="go-to-my-profile-page"
              variant="contained"
              color="primary"
              size="large"
            >
              {t('redirect-button')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  )
}
