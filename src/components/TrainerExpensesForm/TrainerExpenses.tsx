import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DropdownMenu } from '@app/components/DropdownMenu'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import { ExpensesInput, TrainerInput, TransportMethod } from '@app/types'
import { noop } from '@app/util'

import { getError, transportMethodToDropdownItem } from './helpers'

export type FormValues = ExpensesInput

type Props = {
  value?: FormValues
  trainer: TrainerInput
  onChange?: (data: FormValues, isValid: boolean) => void
}

export const TrainerExpenses: React.FC<Props> = ({
  trainer,
  value = undefined,
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup.object({
        transport: yup
          .array()
          .of(
            yup.object({
              method: yup
                .mixed()
                .oneOf(Object.values(TransportMethod))
                .required(
                  t('pages.create-course.trainer-expenses.method-error')
                ),
              value: yup
                .number()
                .min(
                  0,
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 0,
                  })
                )
                .typeError(
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 0,
                  })
                )
                .when('method', {
                  is: TransportMethod.NONE,
                  then: s => s.optional(),
                  otherwise: s =>
                    s.required(
                      t('pages.create-course.trainer-expenses.value-error')
                    ),
                }),
              flightDays: yup
                .number()
                .integer()
                .positive(
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 1,
                  })
                )
                .typeError(
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 1,
                  })
                )
                .when('method', {
                  is: TransportMethod.FLIGHTS,
                  then: s =>
                    s.required(
                      t('pages.create-course.trainer-expenses.days-error')
                    ),
                  otherwise: s => s.optional(),
                }),
              accommodationNights: yup
                .number()
                .integer()
                .min(
                  0,
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 0,
                  })
                )
                .typeError(
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 0,
                  })
                )
                .when('method', {
                  is: TransportMethod.NONE,
                  then: s => s.optional(),
                  otherwise: s =>
                    s.required(
                      t('pages.create-course.trainer-expenses.nights-error')
                    ),
                }),
            })
          )
          .required(),
        miscellaneous: yup.array().of(
          yup.object({
            name: yup
              .string()
              .required(t('pages.create-course.trainer-expenses.name-error')),
            value: yup
              .number()
              .min(
                0,
                t('pages.create-course.trainer-expenses.num-error', { min: 0 })
              )
              .typeError(
                t('pages.create-course.trainer-expenses.num-error', { min: 0 })
              )
              .required(t('pages.create-course.trainer-expenses.value-error')),
          })
        ),
      }),
    [t]
  )

  const { control, formState, register, setValue, trigger, unregister } =
    useForm<FormValues>({
      defaultValues: value,
      mode: 'all',
      resolver: yupResolver(schema) as Resolver<FormValues>,
    })

  const formValues = useWatch({ control })

  const { errors } = formState
  const { transport, miscellaneous } = formValues

  useEffect(() => {
    onChange(formValues as FormValues, formState.isValid)
  }, [formValues, formState.isValid, onChange])

  const showAddTripButton = Boolean(
    transport &&
      transport?.length > 0 &&
      transport[transport.length - 1] &&
      transport[transport.length - 1].method !== TransportMethod.NONE
  )

  return (
    <Stack spacing={0} ml={2} mt={3}>
      <Typography fontWeight="600">{trainer.fullName}</Typography>

      {transport?.map((entry, idx) =>
        entry ? (
          <>
            <Grid container spacing={2} mt={0}>
              <Grid item xs={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>
                    {t(
                      'pages.create-course.trainer-expenses.method-of-transport'
                    )}
                  </InputLabel>
                  <Controller
                    name={`transport.${idx}.method`}
                    control={control}
                    render={({ field }) => (
                      <DropdownMenu<TransportMethod>
                        value={transportMethodToDropdownItem(field.value)}
                        items={Object.values(TransportMethod).map(
                          transportMethodToDropdownItem
                        )}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'method')}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {entry.method !== TransportMethod.NONE ? (
                <Grid item xs={5}>
                  <TextField
                    label={t(
                      `pages.create-course.trainer-expenses.value-label.${entry.method}`
                    )}
                    {...register(`transport.${idx}.value`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0.1 }}
                    error={Boolean(getError(errors, idx, 'value'))}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'value')}
                  </FormHelperText>
                </Grid>
              ) : (
                <Grid item xs={5} />
              )}

              {transport?.length && transport.length > 1 ? (
                <Grid item xs={1} mt={2}>
                  <DeleteIcon
                    color="primary"
                    onClick={() => unregister(`transport.${idx}`)}
                  />
                </Grid>
              ) : null}
            </Grid>

            {entry.method === TransportMethod.FLIGHTS ? (
              <Grid container mt={2}>
                <Grid item xs={2}>
                  <TextField
                    label={t(
                      `pages.create-course.trainer-expenses.value-label.${entry.method}-days`
                    )}
                    {...register(`transport.${idx}.flightDays`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0.1 }}
                    error={Boolean(getError(errors, idx, 'flightDays'))}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'flightDays')}
                  </FormHelperText>
                </Grid>
              </Grid>
            ) : null}

            {entry.method !== TransportMethod.NONE ? (
              <Grid container mt={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={e => {
                          let newValue = 1
                          if (!e.target.checked) {
                            newValue = 0
                          }

                          setValue(
                            `transport.${idx}.accommodationNights`,
                            newValue,
                            {
                              shouldValidate: true,
                            }
                          )
                        }}
                        checked={Boolean(
                          entry.accommodationNights &&
                            entry.accommodationNights > 0
                        )}
                      />
                    }
                    label={t(
                      'pages.create-course.trainer-expenses.accommodation'
                    )}
                  />
                </Grid>
              </Grid>
            ) : null}

            {entry.method !== TransportMethod.NONE &&
            entry.accommodationNights &&
            entry.accommodationNights > 0 ? (
              <Grid container mt={0}>
                <Grid item xs={6}>
                  <TextField
                    label={t(
                      'pages.create-course.trainer-expenses.accommodation-nights'
                    )}
                    {...register(`transport.${idx}.accommodationNights`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    type="number"
                    inputProps={{ min: 1 }}
                    error={Boolean(
                      getError(errors, idx, 'accommodationNights')
                    )}
                  />
                  <Typography variant="caption">
                    {t(
                      'pages.create-course.trainer-expenses.accommodation-caption'
                    )}
                  </Typography>
                  <FormHelperText error>
                    {getError(errors, idx, 'accommodationNights')}
                  </FormHelperText>
                </Grid>
              </Grid>
            ) : null}
          </>
        ) : null
      )}

      {showAddTripButton ? (
        <Button
          variant="text"
          sx={{
            marginTop: theme.spacing(4),
            marginLeft: theme.spacing(2),
            width: 'fit-content',
          }}
          startIcon={<AddIcon />}
          onClick={() => {
            const name: `transport.${number}` = `transport.${
              transport?.length ?? 0
            }`
            register(name, {
              value: { method: TransportMethod.NONE },
            })
            trigger(name)
          }}
        >
          {t('pages.create-course.trainer-expenses.another-trip')}
        </Button>
      ) : null}

      {miscellaneous?.map((entry, idx) =>
        entry ? (
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <TextField
                label={t('pages.create-course.trainer-expenses.misc-item-name')}
                {...register(`miscellaneous.${idx}.name`)}
                variant="filled"
                fullWidth
                type="text"
                error={Boolean(getError(errors, idx, 'name'))}
              />
              <FormHelperText error>
                {getError(errors, idx, 'name')}
              </FormHelperText>
            </Grid>

            <Grid item xs={5}>
              <TextField
                label={t('pages.create-course.trainer-expenses.misc-item-cost')}
                {...register(`miscellaneous.${idx}.value`)}
                variant="filled"
                fullWidth
                type="text"
                error={Boolean(getError(errors, idx, 'value'))}
              />
              <FormHelperText error>
                {getError(errors, idx, 'value')}
              </FormHelperText>
            </Grid>

            <Grid item xs={1} mt={2}>
              <DeleteIcon
                color="primary"
                onClick={() => unregister(`miscellaneous.${idx}`)}
              />
            </Grid>
          </Grid>
        ) : null
      )}

      <Button
        variant="outlined"
        sx={{
          marginTop: theme.spacing(4),
          width: 'fit-content',
        }}
        startIcon={<AddIcon />}
        onClick={() => {
          const newEntry = { name: '', value: 0 }
          const name: `miscellaneous.${number}` = `miscellaneous.${
            miscellaneous?.length ?? 0
          }`
          setValue(name, newEntry, { shouldValidate: false })
        }}
      >
        {t('pages.create-course.trainer-expenses.miscellaneous-costs')}
      </Button>
    </Stack>
  )
}
