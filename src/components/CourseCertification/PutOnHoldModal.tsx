import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { zonedTimeToUtc } from 'date-fns-tz'
import enLocale from 'date-fns/locale/en-GB'
import React, { useCallback, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import {
  Course_Certificate_Changelog_Type_Enum,
  Course_Level_Enum,
  GetCertificateQuery,
  InsertCourseCertificateChangelogMutation,
  InsertCourseCertificateChangelogMutationVariables,
  InsertCourseCertificateHoldRequestMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { INSERT_CERTIFICATE_CHANGELOG_MUTATION } from '@app/queries/certificate/insert-course-certificate-changelog'
import { INSERT_CERTIFICATE_HOLD_MUTATION } from '@app/queries/certificate/insert-course-certificate-hold-request'
import theme from '@app/theme'
import { NonNullish } from '@app/types'

import ConfirmDatesModal from './ConfirmDatesModal'

type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>

type CertificateChangelog = Pick<
  NonNullish<Participant['participant']>,
  'certificateChanges'
>

type PutOnHoldModalProps = {
  courseLevel: Course_Level_Enum
  participantId: string
  certificateId: string
  certificateExpiryDate: string
  edit: boolean
  changelogs: NonNullish<CertificateChangelog['certificateChanges']>
  onClose: () => void
}

enum HoldReasons {
  Maternity = 'MATERNITY',
  Sickness = 'SICKNESS',
  Legal = 'LEGAL',
  Others = 'OTHERS',
}

const type = [
  HoldReasons.Maternity,
  HoldReasons.Sickness,
  HoldReasons.Legal,
  HoldReasons.Others,
]

const PutOnHoldModal: React.FC<React.PropsWithChildren<PutOnHoldModalProps>> =
  function ({
    onClose,
    courseLevel,
    participantId,
    certificateId,
    edit,
    changelogs,
    certificateExpiryDate,
  }) {
    const { t } = useTranslation()
    const fetcher = useFetcher()
    const [error, setError] = useState<string>()
    const lastChangelog = useMemo(() => changelogs[0], [changelogs])
    const [showHoldModal, setShowHoldModal] = useState(true)

    const minDate = useMemo(() => new Date(Date.now()), [])
    const schema = useMemo(() => {
      return yup
        .object({
          dateFrom: yup
            .date()
            .typeError(t('validation-errors.invalid-date'))
            .required(t('validation-errors.required-date')),
          dateTo: yup
            .date()
            .typeError(t('validation-errors.invalid-date'))
            .required(t('validation-errors.required-date'))
            .min(
              yup.ref('dateFrom'),
              t(
                'common.course-certificate.put-on-hold-modal.to-date-greater-error'
              )
            ),
          reasonSelected: yup
            .string()
            .required(
              t(
                'common.course-certificate.put-on-hold-modal.select-reason-error'
              )
            ),
          note: yup.string().nullable(),
        })
        .required()
    }, [t])

    const {
      handleSubmit,
      formState: { errors },
      watch,
      control,
      getValues,
    } = useForm<yup.InferType<typeof schema>>({
      resolver: yupResolver(schema),
      defaultValues: {
        dateFrom: edit ? lastChangelog?.payload?.startDate : null,
        dateTo: edit ? lastChangelog?.payload?.expireDate : null,
        reasonSelected: edit ? lastChangelog?.payload?.reason : '',
        note: edit ? lastChangelog?.payload?.note : '',
      },
    })

    const handleClose = useCallback(() => {
      setShowHoldModal(true)
      onClose()
    }, [onClose])

    const submitHandler: SubmitHandler<yup.InferType<typeof schema>> =
      useCallback(async () => {
        try {
          const values = getValues()
          if (!values.dateFrom || !values.dateTo) {
            return
          }

          const { insertChangeLog } = await fetcher<
            InsertCourseCertificateChangelogMutation,
            InsertCourseCertificateChangelogMutationVariables
          >(INSERT_CERTIFICATE_CHANGELOG_MUTATION, {
            participantId,
            payload: {
              startDate: values.dateFrom,
              expireDate: values.dateTo,
              note: values.note,
              reason: values.reasonSelected,
              certificateId,
            },
            type: Course_Certificate_Changelog_Type_Enum.PutOnHold,
          })

          let timeDiff = 0
          const dateFrom = zonedTimeToUtc(values.dateFrom, 'GMT')
          const dateTo = zonedTimeToUtc(values.dateTo, 'GMT')

          if (edit) {
            timeDiff =
              new Date(lastChangelog?.payload?.expireDate).getTime() -
              dateFrom.getTime()
          } else {
            timeDiff = dateTo.getTime() - dateFrom.getTime()
          }

          const totalDiff = timeDiff + new Date(certificateExpiryDate).getTime()
          const expireDate = zonedTimeToUtc(new Date(totalDiff), 'GMT')

          await fetcher<
            null,
            InsertCourseCertificateHoldRequestMutationVariables
          >(INSERT_CERTIFICATE_HOLD_MUTATION, {
            certificateId,
            changelogId: insertChangeLog?.id,
            expireDate: dateTo,
            startDate: dateFrom,
            newExpiryDate: expireDate.toISOString(),
          })
          handleClose()
        } catch (e: unknown) {
          setError((e as Error).message)
        }
      }, [
        certificateExpiryDate,
        certificateId,
        edit,
        fetcher,
        getValues,
        handleClose,
        lastChangelog,
        participantId,
      ])

    const values = watch()
    const canSubmit = showHoldModal && !edit

    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={enLocale}
      >
        <Box p={2}>
          <form onSubmit={handleSubmit(submitHandler)}>
            {showHoldModal ? (
              <Grid container spacing={4}>
                <Grid item xs={12} container rowGap={2}>
                  <Grid item xs={6}>
                    <Typography
                      color={theme.palette.grey[700]}
                      fontWeight={600}
                    >
                      {t('common.course-certificate.put-on-hold-modal.reason')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="reasonSelected"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id="reasonSelected"
                          select
                          label={t(
                            'common.course-certificate.put-on-hold-modal.select-reason'
                          )}
                          variant="filled"
                          value={field.value}
                          onChange={field.onChange}
                          inputProps={{ 'data-testid': 'hold-reason-select' }}
                          error={!!errors.reasonSelected}
                          helperText={errors.reasonSelected?.message}
                          disabled={edit}
                          fullWidth
                        >
                          {type.map(level => (
                            <MenuItem
                              key={level}
                              value={level}
                              data-testid={`hold-reason-option-${level}`}
                            >
                              {t(
                                `common.course-certificate.put-on-hold-modal.reasons.${level.toLocaleLowerCase()}`
                              )}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container rowGap={2}>
                  <Grid item xs={6}>
                    <Typography
                      color={theme.palette.grey[700]}
                      fontWeight={600}
                    >
                      {edit
                        ? t(
                            'common.course-certificate.put-on-hold-modal.add-updated-notes'
                          )
                        : t(
                            'common.course-certificate.put-on-hold-modal.notes'
                          )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="note"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState }) => (
                        <TextField
                          fullWidth
                          variant="filled"
                          error={fieldState.invalid}
                          label={t(
                            'common.course-certificate.put-on-hold-modal.please-add-a-note'
                          )}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container rowGap={2} columnGap={15}>
                  <Grid item xs={5}>
                    <Controller
                      name="dateFrom"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minDate={minDate}
                          maxDate={values.dateTo || undefined}
                          disabled={edit}
                          renderInput={params => (
                            <TextField
                              {...params}
                              data-testid="DateFrom"
                              label={t('common.from')}
                              variant="standard"
                              error={!!errors.dateFrom}
                              helperText={errors.dateFrom?.message}
                              disabled={edit}
                              fullWidth
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Controller
                      name="dateTo"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minDate={values.dateFrom || undefined}
                          renderInput={params => (
                            <TextField
                              {...params}
                              data-testid="DateTo"
                              label={t('common.to')}
                              variant="standard"
                              error={!!errors.dateTo}
                              helperText={errors.dateTo?.message}
                              fullWidth
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {courseLevel === Course_Level_Enum.AdvancedTrainer ||
                courseLevel === Course_Level_Enum.IntermediateTrainer ? (
                  <Grid item xs={12}>
                    <Alert
                      variant="outlined"
                      color="warning"
                      severity="warning"
                    >
                      {t('common.course-certificate.put-on-hold-modal.warning')}{' '}
                    </Alert>
                  </Grid>
                ) : null}
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={handleClose}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type={canSubmit ? 'submit' : 'button'}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={
                      canSubmit ? undefined : () => setShowHoldModal(false)
                    }
                  >
                    {t('common.course-certificate.hold-certificate')}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <ConfirmDatesModal
                onClose={handleClose}
                reasonSelected={values.reasonSelected}
                dateTo={values.dateTo}
                expireDate={lastChangelog?.payload?.expireDate}
                error={error}
              />
            )}
          </form>
        </Box>
      </LocalizationProvider>
    )
  }

export default PutOnHoldModal
