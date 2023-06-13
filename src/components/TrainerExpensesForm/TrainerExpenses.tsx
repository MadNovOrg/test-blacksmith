import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { TFunction } from 'i18next'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DropdownMenu } from '@app/components/DropdownMenu'
import { NumericTextField } from '@app/components/NumericTextField'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import { ExpensesInput, TrainerInput, TransportMethod } from '@app/types'
import { DEFAULT_ACCOMMODATION_COST_PER_NIGHT, noop } from '@app/util'

import { getError, transportMethodToDropdownItem } from './helpers'

export type FormValues = ExpensesInput

type Props = {
  value?: FormValues
  trainer: TrainerInput
  onChange?: (data: FormValues, isValid: boolean) => void
}

export const makeSchema = (t: TFunction) =>
  yup.object({
    transport: yup
      .array()
      .of(
        yup.object({
          method: yup
            .mixed()
            .oneOf(Object.values(TransportMethod))
            .required(t('pages.create-course.trainer-expenses.method-error')),
          value: yup
            .number()
            .typeError(
              t('pages.create-course.trainer-expenses.num-error', {
                min: 0,
              })
            )
            .when('method', ([method], s) => {
              if (method === TransportMethod.NONE) {
                return s
              }
              return s
                .required(t('pages.create-course.trainer-expenses.value-error'))
                .min(
                  1,
                  t('pages.create-course.trainer-expenses.num-error', {
                    min: 0,
                  })
                )
            }),
          flightDays: yup
            .number()
            .integer()
            .typeError(
              t('pages.create-course.trainer-expenses.num-error', {
                min: 0,
              })
            )
            .when('method', ([method], s) => {
              if (method === TransportMethod.FLIGHTS) {
                return s
                  .required(
                    t('pages.create-course.trainer-expenses.days-error')
                  )
                  .min(
                    1,
                    t('pages.create-course.trainer-expenses.num-error', {
                      min: 1,
                    })
                  )
              }
              return s
            }),
          accommodationRequired: yup.boolean(),
          accommodationNights: yup
            .number()
            .integer()
            .typeError(
              t('pages.create-course.trainer-expenses.num-error', {
                min: 0,
              })
            )
            .when(
              ['accommodationRequired', 'method'],
              ([accommodationRequired, method], s) => {
                if (accommodationRequired && method !== TransportMethod.NONE) {
                  return s.min(
                    1,
                    t('pages.create-course.trainer-expenses.num-error', {
                      min: 1,
                    })
                  )
                }
                return s
              }
            ),
          accommodationCost: yup
            .number()
            .typeError(
              t('pages.create-course.trainer-expenses.num-error', { min: 0 })
            )
            .when(
              ['accommodationNights', 'method'],
              ([accommodationNights, method], s) => {
                if (accommodationNights && method !== TransportMethod.NONE) {
                  return s
                    .required(
                      t(
                        'pages.create-course.trainer-expenses.accommodation-cost-error'
                      )
                    )
                    .min(
                      0,
                      t('pages.create-course.trainer-expenses.num-error', {
                        min: 1,
                      })
                    )
                }
                return s
              }
            ),
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
          .when('name', {
            is: '',
            then: s => s.nullable(),
            otherwise: s =>
              s.required(t('pages.create-course.trainer-expenses.value-error')),
          }),
      })
    ),
  })

export const TrainerExpenses: React.FC<React.PropsWithChildren<Props>> = ({
  trainer,
  value = {
    transport: [{ method: TransportMethod.NONE, value: 0 }],
  },
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(() => makeSchema(t), [t])

  const [displayAccommodation, setDisplayAccommodation] = useState<
    Record<number, boolean>
  >({})

  const { control, formState, register, setValue, unregister } =
    useForm<FormValues>({
      defaultValues: value,
      mode: 'all',
      resolver: yupResolver(schema) as Resolver<FormValues>,
    })

  const formValues = useWatch({ control })

  const { errors, isValid } = formState
  const { transport, miscellaneous } = formValues

  useEffect(() => {
    const newDisplayAccommodation = { ...displayAccommodation }
    transport?.forEach((entry, idx) => {
      if (entry?.accommodationNights && entry.accommodationNights > 0) {
        newDisplayAccommodation[idx] = true
      }
    })
    setDisplayAccommodation(newDisplayAccommodation)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  useEffect(() => {
    onChange(formValues as FormValues, isValid)
  }, [formValues, isValid, onChange])

  const validTransport = transport?.filter(Boolean) ?? []

  const showAddTripButton =
    validTransport &&
    validTransport.length > 0 &&
    validTransport[validTransport.length - 1].method !== TransportMethod.NONE

  return (
    <Box p={2} sx={{ background: theme.palette.common.white }}>
      <Typography fontWeight="600">{trainer.fullName}</Typography>
      {transport?.map((entry, idx) =>
        entry ? (
          <Fragment key={idx}>
            <Grid container spacing={2} mt={0}>
              <Grid item md={6} sm={12}>
                <FormControl
                  variant="filled"
                  fullWidth
                  data-testid={`trip-${idx}-dropdown`}
                >
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
                        onChange={e => {
                          if (e.target.value === TransportMethod.NONE) {
                            setValue(`transport.${idx}.accommodationNights`, 0)
                            setValue(`transport.${idx}.accommodationCost`, 0)
                            setValue(`transport.${idx}.value`, 0)
                            setValue(`transport.${idx}.flightDays`, 0)
                          }
                          field.onChange(e)
                        }}
                      />
                    )}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'method')}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {entry.method !== TransportMethod.NONE ? (
                <Grid item md={5} sm={12}>
                  <NumericTextField
                    label={t(
                      `pages.create-course.trainer-expenses.value-label.${entry.method}`
                    )}
                    {...register(`transport.${idx}.value`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    defaultValue={1}
                    inputProps={{
                      min: 0,
                      step: 0.01,
                      inputMode: 'numeric',
                      pattern: '\\d*(\\.\\d*)?',
                      'data-testid': `trip-${idx}-input`,
                    }}
                    error={Boolean(getError(errors, idx, 'value'))}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'value')}
                  </FormHelperText>
                </Grid>
              ) : (
                <Grid item md={5} sm={12} />
              )}

              {validTransport.length > 1 ? (
                <Grid item xs={1} mt={2}>
                  <Button
                    variant="text"
                    onClick={() => {
                      unregister(`transport.${idx}.method`)
                      unregister(`transport.${idx}.value`)
                      unregister(`transport.${idx}.flightDays`)
                      unregister(`transport.${idx}.accommodationNights`)
                      unregister(`transport.${idx}.accommodationCost`)
                      unregister(`transport.${idx}`)

                      const currentDisplay = { ...displayAccommodation }
                      delete currentDisplay[idx]
                      setDisplayAccommodation(currentDisplay)
                    }}
                    sx={{
                      minWidth: 0,
                      ':hover': {
                        backgroundColor: 'inherit',
                      },
                    }}
                    data-testid={`trip-${idx}-delete-button`}
                  >
                    <DeleteIcon color="primary" />
                  </Button>
                </Grid>
              ) : null}
            </Grid>

            {entry.method === TransportMethod.FLIGHTS ? (
              <Grid container mt={2}>
                <Grid item sm={4} md={2}>
                  <NumericTextField
                    label={t(
                      `pages.create-course.trainer-expenses.value-label.${entry.method}-days`
                    )}
                    {...register(`transport.${idx}.flightDays`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    defaultValue={1}
                    inputProps={{
                      min: 1,
                      step: 1,
                      inputMode: 'numeric',
                      pattern: '\\d*',
                      'data-testid': `trip-${idx}-flight-days`,
                    }}
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
                <Grid item md={6} sm={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={e => {
                          setValue(
                            `transport.${idx}.accommodationRequired`,
                            e.target.checked
                          )
                          if (e.target.checked) {
                            setValue(`transport.${idx}.accommodationNights`, 1)
                            setValue(
                              `transport.${idx}.accommodationCost`,
                              DEFAULT_ACCOMMODATION_COST_PER_NIGHT
                            )
                          } else {
                            setValue(`transport.${idx}.accommodationNights`, 0)
                            setValue(`transport.${idx}.accommodationCost`, 0)
                          }

                          const currentDisplay = { ...displayAccommodation }
                          currentDisplay[idx] = e.target.checked
                          setDisplayAccommodation(currentDisplay)
                        }}
                        checked={displayAccommodation[idx] || false}
                        data-testid={`accommodation-${idx}-switch`}
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
            displayAccommodation[idx] ? (
              <Grid container spacing={2} mt={0}>
                <Grid item md={6} sm={12}>
                  <NumericTextField
                    label={t(
                      'pages.create-course.trainer-expenses.accommodation-nights'
                    )}
                    {...register(`transport.${idx}.accommodationNights`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    defaultValue={1}
                    inputProps={{
                      min: 1,
                      step: 1,
                      inputMode: 'numeric',
                      pattern: '\\d*',
                      'data-testid': `trip-${idx}-accommodation-nights`,
                    }}
                    error={Boolean(
                      getError(errors, idx, 'accommodationNights')
                    )}
                  />
                  <FormHelperText error>
                    {getError(errors, idx, 'accommodationNights')}
                  </FormHelperText>
                </Grid>

                <Grid item md={5} sm={12}>
                  <NumericTextField
                    label={t(
                      'pages.create-course.trainer-expenses.accommodation-cost'
                    )}
                    {...register(`transport.${idx}.accommodationCost`, {
                      valueAsNumber: true,
                    })}
                    variant="filled"
                    fullWidth
                    defaultValue={1}
                    inputProps={{
                      min: 0,
                      step: 0.01,
                      inputMode: 'numeric',
                      pattern: '\\d*(\\.\\d*)?',
                      'data-testid': `trip-${idx}-accommodation-cost`,
                    }}
                    error={Boolean(getError(errors, idx, 'accommodationCost'))}
                  />
                  <Typography variant="caption">
                    {t(
                      'pages.create-course.trainer-expenses.accommodation-caption'
                    )}
                  </Typography>
                  <FormHelperText error>
                    {getError(errors, idx, 'accommodationCost')}
                  </FormHelperText>
                </Grid>
              </Grid>
            ) : null}
          </Fragment>
        ) : null
      )}

      {showAddTripButton ? (
        <Box>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => {
              const idx = transport?.length ?? 0
              const name: `transport.${number}` = `transport.${idx}`
              const newEntry = { method: TransportMethod.NONE }
              setValue(name, newEntry)
              setDisplayAccommodation({ ...displayAccommodation, [idx]: false })
            }}
            data-testid="add-trip-button"
          >
            {t('pages.create-course.trainer-expenses.another-trip')}
          </Button>
        </Box>
      ) : null}

      {miscellaneous?.map((entry, idx) =>
        entry ? (
          <Grid key={idx} container mt={2} rowSpacing={2}>
            <Grid item md={6} sm={12}>
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

            <Grid item md={5} sm={12}>
              <NumericTextField
                label={t('pages.create-course.trainer-expenses.misc-item-cost')}
                {...register(`miscellaneous.${idx}.value`, {
                  valueAsNumber: true,
                })}
                variant="filled"
                fullWidth
                inputProps={{
                  min: 0,
                  step: 0.01,
                  inputMode: 'numeric',
                  pattern: '\\d*(\\.\\d*)?',
                }}
                error={Boolean(getError(errors, idx, 'value'))}
              />
              <FormHelperText error>
                {getError(errors, idx, 'value')}
              </FormHelperText>
            </Grid>

            <Grid item xs={1} mt={2}>
              <Button
                variant="text"
                onClick={() => {
                  unregister(`miscellaneous.${idx}.name`)
                  unregister(`miscellaneous.${idx}.value`)
                  unregister(`miscellaneous.${idx}`)
                }}
                sx={{
                  minWidth: 0,
                  ':hover': {
                    backgroundColor: 'inherit',
                  },
                }}
              >
                <DeleteIcon color="primary" />
              </Button>
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
          const newEntry = { name: null, value: null }
          const name: `miscellaneous.${number}` = `miscellaneous.${
            miscellaneous?.length ?? 0
          }`
          setValue(name, newEntry)
        }}
      >
        {t('pages.create-course.trainer-expenses.miscellaneous-costs')}
      </Button>
    </Box>
  )
}
