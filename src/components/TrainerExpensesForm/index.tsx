import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Box, Stack } from '@mui/material'
import { mapValues, zipObject } from 'lodash-es'
import React, { memo, useEffect, useMemo } from 'react'
import { useForm, Controller, Resolver, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { yup } from '@app/schemas'
import { TrainerInput, TransportMethod } from '@app/types'

import { FormValues as Entry, TrainerExpenses } from './TrainerExpenses'

export type FormValues = Record<string, Entry>

type Props = {
  trainers?: TrainerInput[]
  onChange?: (data: FormValues, isValid: boolean) => void
}

const TrainerExpensesForm: React.FC<Props> = ({
  trainers = [],
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup.lazy(obj =>
        yup.object(
          mapValues(obj, () =>
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
                            t(
                              'pages.create-course.trainer-expenses.value-error'
                            )
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
                            t(
                              'pages.create-course.trainer-expenses.nights-error'
                            )
                          ),
                      }),
                  })
                )
                .required(),
              miscellaneous: yup.array().of(
                yup.object({
                  name: yup
                    .string()
                    .required(
                      t('pages.create-course.trainer-expenses.name-error')
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
                    .required(
                      t('pages.create-course.trainer-expenses.value-error')
                    ),
                })
              ),
            })
          )
        )
      ),
    [t]
  )

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: zipObject(
      trainers.map(t => t.profile_id),
      trainers.map(_ => ({
        transport: [
          {
            method: TransportMethod.NONE,
            value: 0,
            days: 0,
            accommodationNights: 0,
          },
        ],
        miscellaneous: [],
      }))
    ),
    resolver: yupResolver(schema) as Resolver<FormValues>,
  })

  const formValues = useWatch({
    control: form.control,
  })

  useEffect(() => {
    onChange(formValues as FormValues, form.formState.isValid)
  }, [formValues, form.formState, onChange])

  return (
    <Stack component="form" spacing={5} data-testid="TrainerExpenses-form">
      <Box>
        <Typography variant="subtitle1">
          {t('pages.create-course.trainer-expenses.title')}
        </Typography>

        {trainers.map(trainer => (
          <React.Fragment key={trainer.profile_id}>
            <Controller
              name={trainer.profile_id}
              control={form.control}
              render={({ field }) => (
                <TrainerExpenses
                  trainer={trainer}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </React.Fragment>
        ))}
      </Box>
    </Stack>
  )
}

export default memo(TrainerExpensesForm)
