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
import { addDays, parseISO, differenceInDays } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { zonedTimeToUtc } from 'date-fns-tz'
import React, { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'
import * as yup from 'yup'

import {
  Course_Certificate_Changelog_Type_Enum,
  GetCertificateQuery,
  InsertCourseCertificateChangelogMutation,
  InsertCourseCertificateChangelogMutationVariables,
  InsertCourseCertificateHoldRequestMutation,
  InsertCourseCertificateHoldRequestMutationVariables,
} from '@app/generated/graphql'
import { INSERT_CERTIFICATE_CHANGELOG_MUTATION } from '@app/modules/course_details/course_certification_tab/queries/insert-course-certificate-changelog'
import { INSERT_CERTIFICATE_HOLD_MUTATION } from '@app/modules/course_details/course_certification_tab/queries/insert-course-certificate-hold-request'
import theme from '@app/theme'
import { NonNullish } from '@app/types'

import ConfirmDatesModal from '../ConfirmDatesModal/ConfirmDatesModal'

const MINUTES_IN_FUTURE = 10

type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>

type CertificateChangelog = Pick<
  NonNullish<Participant['participant']>,
  'certificateChanges'
>

type PutOnHoldModalProps = {
  participantId: string
  certificateId: string
  certificateExpiryDate: string
  edit: boolean
  changelogs: NonNullish<CertificateChangelog['certificateChanges']>
  onClose: () => void
  holdRequest?: GetCertificateQuery['certificateHoldRequest'][0]
  refetch: () => void
}

export enum HoldReasons {
  Maternity = 'MATERNITY',
  Sickness = 'SICKNESS',
  Legal = 'LEGAL',
  Others = 'OTHERS',
}

export const type = [
  HoldReasons.Maternity,
  HoldReasons.Sickness,
  HoldReasons.Legal,
  HoldReasons.Others,
]

const PutOnHoldModal: React.FC<React.PropsWithChildren<PutOnHoldModalProps>> =
  function ({
    onClose,
    participantId,
    certificateId,
    edit,
    changelogs,
    certificateExpiryDate,
    holdRequest,
    refetch,
  }) {
    const { t } = useTranslation()
    const [error, setError] = useState<string>()
    const lastChangelog = useMemo(() => changelogs[0], [changelogs])
    const [showHoldModal, setShowHoldModal] = useState(true)

    const [, insertCertificateChangelog] = useMutation<
      InsertCourseCertificateChangelogMutation,
      InsertCourseCertificateChangelogMutationVariables
    >(INSERT_CERTIFICATE_CHANGELOG_MUTATION)

    const [, insertCertificateHold] = useMutation<
      InsertCourseCertificateHoldRequestMutation,
      InsertCourseCertificateHoldRequestMutationVariables
    >(INSERT_CERTIFICATE_HOLD_MUTATION)

    const schema = useMemo(() => {
      return yup
        .object({
          dateFrom: yup.date().required(t('validation-errors.required-date')),
          dateTo: yup
            .date()
            .required(t('validation-errors.required-date'))
            .min(
              yup.ref('dateFrom'),
              t(
                'common.course-certificate.put-on-hold-modal.to-date-greater-error',
              ),
            ),
          reasonSelected: yup
            .string()
            .required(
              t(
                'common.course-certificate.put-on-hold-modal.select-reason-error',
              ),
            ),
          note: yup
            .string()
            .required(
              t('common.course-certificate.put-on-hold-modal.note-error'),
            ),
        })
        .required()
    }, [t])

    const {
      handleSubmit,
      formState: { errors },
      watch,
      register,
      control,
    } = useForm<yup.InferType<typeof schema>>({
      resolver: yupResolver(schema),
      defaultValues: {
        dateFrom: edit ? parseISO(holdRequest?.start_date) : undefined,
        dateTo: edit ? parseISO(holdRequest?.expiry_date) : undefined,
        reasonSelected: edit ? lastChangelog.payload.reason : '',
        note: edit ? lastChangelog.payload.note : '',
      },
    })

    const handleClose = useCallback(() => {
      setShowHoldModal(false)
      onClose()
    }, [onClose])

    const onSubmit = (data: yup.InferType<typeof schema>) => {
      const currentDate = new Date(Date.now())
      data.dateTo.setHours(
        currentDate.getHours(),
        currentDate.getMinutes() + MINUTES_IN_FUTURE,
      )

      insertCertificateChangelog({
        participantId,
        payload: {
          startDate: data.dateFrom,
          expireDate: data.dateTo,
          note: data.note,
          reason: data.reasonSelected,
          certificateId,
        },
        type: Course_Certificate_Changelog_Type_Enum.PutOnHold,
      })
        .then(async ({ data: response }) => {
          const changelogId = response?.insertChangeLog?.id

          let timeDiff = 0
          const dateFrom = zonedTimeToUtc(data.dateFrom, 'GMT')
          const dateTo = zonedTimeToUtc(data.dateTo, 'GMT')

          if (edit) {
            timeDiff = differenceInDays(
              dateTo,
              new Date(holdRequest?.expiry_date),
            )
          } else {
            timeDiff = differenceInDays(dateTo, dateFrom)
          }

          const totalDiff = addDays(new Date(certificateExpiryDate), timeDiff)
          const expireDate = zonedTimeToUtc(new Date(totalDiff), 'GMT')

          try {
            await insertCertificateHold({
              certificateId,
              changelogId: changelogId,
              expireDate: dateTo,
              startDate: dateFrom,
              newExpiryDate: expireDate.toISOString(),
            })
            refetch()
          } catch (e: unknown) {
            setError((e as Error).message)
          }

          handleClose()
        })
        .catch(err => {
          setError(err)
        })
    }

    const values = watch()
    const canSubmit = showHoldModal && !edit

    const minDate = useMemo(() => new Date(Date.now()), [])

    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={enLocale}
      >
        <Box px={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {showHoldModal ? (
              <Grid container spacing={4}>
                <Grid item xs={12} container rowGap={2}>
                  <Grid item xs={6}>
                    <Typography
                      color={theme.palette.grey[700]}
                      fontWeight={600}
                    >
                      {t('common.reason')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('reasonSelected')}
                      select
                      label={t(
                        'common.course-certificate.put-on-hold-modal.select-reason',
                      )}
                      value={values.reasonSelected}
                      defaultValue={values.reasonSelected}
                      variant="filled"
                      data-testid="reason-input"
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
                            `common.course-certificate.put-on-hold-modal.reasons.${level.toLocaleLowerCase()}`,
                          )}
                        </MenuItem>
                      ))}
                    </TextField>
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
                            'common.course-certificate.put-on-hold-modal.add-updated-notes',
                          )
                        : t(
                            'common.course-certificate.put-on-hold-modal.notes',
                          )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('note')}
                      fullWidth
                      variant="filled"
                      data-testid="add-notes"
                      error={!!errors.note}
                      helperText={errors.note?.message}
                      label={t(
                        'common.course-certificate.put-on-hold-modal.please-add-a-note',
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
                          maxDate={addDays(values.dateTo, 1) || undefined}
                          disabled={edit}
                          slotProps={{
                            textField: {
                              // @ts-expect-error no arbitrary props are allowed by types, which is wrong
                              'data-testid': 'DateFrom',
                              label: t('common.from'),
                              variant: 'standard',
                              error: !!errors.dateFrom,
                              helperText: errors.dateFrom?.message,
                              disabled: edit,
                              id: 'DateFrom',
                              fullWidth: true,
                            },
                          }}
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
                          slotProps={{
                            textField: {
                              // @ts-expect-error no arbitrary props are allowed by types, which is wrong
                              'data-testid': 'DateTo',
                              label: t('common.to'),
                              variant: 'standard',
                              error: !!errors.dateTo,
                              id: 'DateTo',
                              helperText: errors.dateTo?.message,
                              fullWidth: true,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  {!edit ? (
                    <Alert
                      variant="outlined"
                      color="warning"
                      severity="warning"
                    >
                      {t('common.course-certificate.put-on-hold-modal.warning')}{' '}
                    </Alert>
                  ) : null}
                </Grid>
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
                    data-testid="submit-on-hold"
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
                expireDate={holdRequest?.expiry_date}
                error={error}
              />
            )}
          </form>
        </Box>
      </LocalizationProvider>
    )
  }

export default PutOnHoldModal
