import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Dialog, Props } from '@app/components/dialogs'
import { useSnackbar } from '@app/context/snackbar'
import {
  GetOrganisationDetailsQuery,
  MergeOrganisationsInput,
  MergeOrganisationsStatus,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { useMergeOrganisations } from '../../hooks/useMergeOrganisations'

export const MergeOrganisationsWarning: FC<
  Props & {
    selectedOrgs: GetOrganisationDetailsQuery['orgs'][0][]
    selectedMain: string
  }
> = props => {
  const [{ fetching }, mergeOrganisations] = useMergeOrganisations()
  const { addSnackbarMessage } = useSnackbar()
  const navigate = useNavigate()
  const { t, _t } = useScopedTranslation('pages.admin.organizations.merge')

  const handleMerging = async () => {
    const { selectedOrgs, selectedMain } = props

    const orgsToBeMerged = selectedOrgs
      .filter(org => org.id !== selectedMain)
      .map(org => org.id)

    const formattedOrganisations: MergeOrganisationsInput = {
      main: selectedMain,
      merge: orgsToBeMerged,
    }

    const { data } = await mergeOrganisations({ input: formattedOrganisations })
    const mergeStatus = data?.mergeOrganisations?.status

    const snackbarMessageKey = `organisation-merge-${
      mergeStatus?.toLocaleLowerCase() as 'success' | 'fail'
    }` as const

    addSnackbarMessage(snackbarMessageKey, {
      label: t(`organisation-merge-${mergeStatus}`),
    })
    if (mergeStatus === MergeOrganisationsStatus.Success) {
      console.log('In merge status success')
      props.onClose()
      navigate('/organisations/list', {
        state: {
          mergeStatus: mergeStatus,
        },
      })
    }
  }

  return (
    <Dialog
      maxWidth={500}
      data-testid="merge-organisations-warning-dialog"
      {...props}
      slots={{
        Title: () => (
          <Typography variant="body1">{t('warning.title')}</Typography>
        ),
        Content: () => (
          <div>
            {fetching ? (
              <Box display="flex" justifyContent="center" m={3} width={400}>
                <CircularProgress />
              </Box>
            ) : (
              <Alert variant="outlined" severity="warning">
                <Typography variant="body2">{t('warning.body1')}</Typography>
                <Typography variant="body2">{t('warning.body2')}</Typography>
              </Alert>
            )}
          </div>
        ),
        Actions: () => (
          <Grid container justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleMerging}>
              {t('warning.proceed')}
            </Button>
            <Button variant="outlined" onClick={props.onClose}>
              {_t('cancel')}
            </Button>
          </Grid>
        ),
      }}
    />
  )
}
