import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { TFunction } from 'i18next'
import { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { utils, read } from 'xlsx'

import {
  useImportContext,
  ImportStepsEnum as ImportSteps,
} from '@app/components/ImportSteps'
import { yup } from '@app/schemas'

function getSchema(t: TFunction) {
  return yup.object({
    firstNameColumn: yup
      .string()
      .required(t('steps.configure.first-name-error')),
    lastNameColumn: yup.string().required(t('steps.configure.last-name-error')),
    emailColumn: yup.string().required(t('steps.configure.email-error')),
    certificateNumberColumn: yup
      .string()
      .required(t('steps.configure.certificate-number-error')),
  })
}

type Schema = yup.InferType<ReturnType<typeof getSchema>>

export const Configure: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: yupResolver(getSchema(t)),
    defaultValues: {
      firstNameColumn: '',
      lastNameColumn: '',
      certificateNumberColumn: '',
      emailColumn: '',
    },
  })

  const { goToStep, data, importConfigured, completeStep } = useImportContext()

  useEffect(() => {
    if (!data) {
      goToStep(ImportSteps.CHOOSE)
    }
  }, [goToStep, data])

  const onSubmitHandler: SubmitHandler<Schema> = data => {
    importConfigured(data)
    completeStep(ImportSteps.CONFIGURE)
    goToStep(ImportSteps.PREVIEW)
  }

  const columns: string[] = useMemo(() => {
    if (!data) {
      return []
    }

    const workbook = read(data, { type: 'base64' })

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const usersData = utils.sheet_to_json(sheet)
    const firstRow = usersData[0]

    return typeof firstRow === 'object' && firstRow ? Object.keys(firstRow) : []
  }, [data])

  return (
    <>
      <Box mb={4}>
        <Typography variant="h4" mb={2}>
          {t('steps.configure.title')}
        </Typography>
        <Typography>{t('steps.configure.description')}</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>
                  {t('steps.configure.first-name-column-label')}
                </InputLabel>
                <Select
                  label={t('steps.configure.first-name-column-label')}
                  {...register('firstNameColumn')}
                  error={Boolean(formState.errors.firstNameColumn?.message)}
                >
                  {columns.map(c => (
                    <MenuItem value={c} key={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {formState.errors.firstNameColumn?.message ? (
                  <FormHelperText
                    error={Boolean(formState.errors.firstNameColumn.message)}
                  >
                    {formState.errors.firstNameColumn.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>
                  {t('steps.configure.last-name-column-label')}
                </InputLabel>
                <Select
                  label={t('steps.configure.last-name-column-label')}
                  {...register('lastNameColumn')}
                  error={Boolean(formState.errors.lastNameColumn?.message)}
                >
                  {columns.map(c => (
                    <MenuItem value={c} key={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {formState.errors.lastNameColumn?.message ? (
                  <FormHelperText
                    error={Boolean(formState.errors.lastNameColumn?.message)}
                  >
                    {formState.errors.lastNameColumn.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>
                  {t('steps.configure.email-column-label')}
                </InputLabel>
                <Select
                  label={t('steps.configure.email-column-label')}
                  {...register('emailColumn')}
                  error={Boolean(formState.errors.emailColumn?.message)}
                >
                  {columns.map(c => (
                    <MenuItem value={c} key={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {formState.errors.emailColumn?.message ? (
                  <FormHelperText
                    error={Boolean(formState.errors.emailColumn.message)}
                  >
                    {formState.errors.emailColumn.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>
                  {t('steps.configure.certificate-number-column-label')}
                </InputLabel>
                <Select
                  label={t('steps.configure.certificate-number-column-label')}
                  {...register('certificateNumberColumn')}
                  error={Boolean(
                    formState.errors.certificateNumberColumn?.message,
                  )}
                >
                  {columns.map(c => (
                    <MenuItem value={c} key={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>

                {formState.errors.certificateNumberColumn?.message ? (
                  <FormHelperText
                    error={Boolean(
                      formState.errors.certificateNumberColumn?.message,
                    )}
                  >
                    {formState.errors.certificateNumberColumn.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => goToStep(ImportSteps.CHOOSE)}
          >
            {t('steps.choose.title')}
          </Button>

          <Button
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
          >
            {t('steps.preview.title')}
          </Button>
        </Box>
      </form>
    </>
  )
}
