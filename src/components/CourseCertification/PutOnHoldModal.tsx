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
import enLocale from 'date-fns/locale/en-GB'
import React, { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { Course_Level_Enum } from '@app/generated/graphql'
import theme from '@app/theme'

export type PutOnHoldModalProps = {
  courseLevel: Course_Level_Enum
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

type HoldInput = {
  dateFrom: Date | null
  dateTo: Date | null
  note: string
  reasonSelected: string
}

const PutOnHoldModal: React.FC<React.PropsWithChildren<PutOnHoldModalProps>> =
  function ({ onClose, courseLevel }) {
    const { t } = useTranslation()

    const schema = useMemo(() => {
      return yup
        .object({
          dateFrom: yup.date().typeError(t('validation-errors.invalid-date')),
          dateTo: yup
            .date()
            .typeError(t('validation-errors.invalid-date'))
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
    } = useForm<HoldInput>({
      resolver: yupResolver(schema),
      defaultValues: {
        dateFrom: null,
        dateTo: null,
        reasonSelected: '',
        note: undefined,
      },
    })

    const submitHandler = useCallback(async () => {
      // Add mutation
      onClose()
    }, [onClose])

    const values = watch()

    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={enLocale}
      >
        <Box p={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} container rowGap={2}>
              <Grid item xs={6}>
                <Typography color={theme.palette.grey[700]} fontWeight={600}>
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
                      required
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
                <Typography color={theme.palette.grey[700]} fontWeight={600}>
                  {t('common.course-certificate.put-on-hold-modal.notes')}
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
                      maxDate={values.dateTo || undefined}
                      renderInput={params => (
                        <TextField
                          {...params}
                          data-testid="DateFrom"
                          label={t('common.from')}
                          variant="standard"
                          error={!!errors.dateFrom}
                          helperText={errors.dateFrom?.message}
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
                <Alert variant="outlined" color="warning" severity="warning">
                  {t('common.course-certificate.put-on-hold-modal.warning')}{' '}
                </Alert>
              </Grid>
            ) : null}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={onClose}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit(submitHandler)}
              >
                {t('common.course-certificate.hold-certificate')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    )
  }

export default PutOnHoldModal
