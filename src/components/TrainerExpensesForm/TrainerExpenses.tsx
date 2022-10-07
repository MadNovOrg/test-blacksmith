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
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form'
import { TransProps, useTranslation } from 'react-i18next'

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

type TFunction = NonNullable<TransProps<string>['t']>

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
          .when('name', {
            is: '',
            then: s => s.nullable(true),
            otherwise: s =>
              s.required(t('pages.create-course.trainer-expenses.value-error')),
          }),
      })
    ),
  })

export const TrainerExpenses: React.FC<Props> = ({
  trainer,
  value = undefined,
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(() => makeSchema(t), [t])

  const [displayAccommodation, setDisplayAccommodation] = useState<boolean[]>([
    false,
  ])

  const { control, formState, register, setValue, unregister } =
    useForm<FormValues>({
      defaultValues: value ?? {
        transport: [{ accommodationNights: 0, method: TransportMethod.NONE }],
      },
      mode: 'all',
      resolver: yupResolver(schema) as Resolver<FormValues>,
    })

  const formValues = useWatch({ control })

  const { errors, isValid } = formState
  const { transport, miscellaneous } = formValues

  useEffect(() => {
    onChange(formValues as FormValues, isValid)

    const newDisplayAccommodations: boolean[] = []
    formValues?.transport?.forEach(t => {
      if (t.accommodationNights && t.accommodationNights > 0) {
        newDisplayAccommodations.push(true)
      } else {
        newDisplayAccommodations.push(false)
      }
    })
    setDisplayAccommodation(newDisplayAccommodations)
  }, [formValues, isValid, onChange])

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
          <Fragment key={idx}>
            <Grid container spacing={2} mt={0}>
              <Grid item xs={6}>
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
                <Grid item xs={5} />
              )}

              {transport?.length && transport.length > 1 ? (
                <Grid item xs={1} mt={2}>
                  <Button
                    variant="text"
                    onClick={() => {
                      unregister(`transport.${idx}`)
                      const currentDisplay = [...displayAccommodation]
                      currentDisplay.splice(idx, 1)
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
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={e => {
                          const currentDisplay = [...displayAccommodation]
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
          </Fragment>
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
            const newEntry = {
              accommodationNights: 0,
              method: TransportMethod.NONE,
            }
            setValue(name, newEntry)
            setDisplayAccommodation([...displayAccommodation, false])
          }}
          data-testid="add-trip-button"
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
                {...register(`miscellaneous.${idx}.value`, {
                  valueAsNumber: true,
                })}
                variant="filled"
                fullWidth
                type="number"
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
                onClick={() => unregister(`miscellaneous.${idx}`)}
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
    </Stack>
  )
}
