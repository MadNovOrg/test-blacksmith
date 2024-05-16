import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Link,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { useSnackbar } from '@app/context/snackbar'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useCreateCourse } from '@app/modules/course/pages/CreateCourse/components/CreateCourseProvider'

type Props = {
  open: boolean
  name?: string | null
  onCancel: () => void
  onSubmit: (name?: string) => void
}

export const DraftConfirmationDialog: React.FC<
  React.PropsWithChildren<Props>
> = ({ open, name, onCancel, onSubmit }) => {
  const { t } = useScopedTranslation('pages.create-course.save-as-draft-dialog')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [draftName, setDraftName] = useState(name)
  const [saveError, setSaveError] = useState(false)
  const [draftNameValidationError, setDraftNameValidationError] = useState('')
  const { addSnackbarMessage } = useSnackbar()

  const { saveDraft } = useCreateCourse()

  useEffect(() => {
    draftName === ''
      ? setDraftNameValidationError(t('no-draft-name'))
      : setDraftNameValidationError('')
  }, [t, draftName])

  const submitHandler = async () => {
    if (draftName) {
      const { id, name, error } = await saveDraft(draftName)

      if (error) {
        setSaveError(true)
        return
      }
      addSnackbarMessage('draft-saved', {
        label: (
          <Trans
            i18nKey="pages.create-course.save-as-draft-dialog.draft-saved"
            values={{ name }}
          >
            <Link underline="always" href={`/drafts/${id}`}>
              {name}
            </Link>
          </Trans>
        ),
      })
      onSubmit()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={
        <Typography variant="h3" fontWeight={600}>
          {t(`title`)}
        </Typography>
      }
      maxWidth={600}
    >
      <Container sx={{ padding: isMobile ? 0 : 3 }}>
        <TextField
          required
          label={t('name')}
          variant="filled"
          placeholder={''}
          fullWidth
          error={!!draftNameValidationError}
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          helperText={draftNameValidationError ?? ''}
          sx={{ mb: 2 }}
        />
        {saveError && (
          <Alert severity="warning" variant="outlined">
            <Typography variant="body1" fontWeight={600}>
              {t(`save-error-message`)}
            </Typography>
          </Alert>
        )}

        <Typography variant="body1" mb={2}>
          {t(`description`)}
        </Typography>

        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="flex-end"
          my={4}
        >
          <Button
            type="button"
            variant="text"
            color="primary"
            onClick={onCancel}
          >
            {t('cancel-btn')}
          </Button>

          <Button
            onClick={submitHandler}
            type="button"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
            disabled={!draftName}
            data-testid="proceed-button"
          >
            {t('confirm-btn')}
          </Button>
        </Box>
      </Container>
    </Dialog>
  )
}
