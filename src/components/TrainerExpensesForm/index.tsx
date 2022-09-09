import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Box, Stack } from '@mui/material'
import { mapValues, zipObject } from 'lodash-es'
import React, { memo, useEffect, useMemo } from 'react'
import { useForm, Controller, Resolver, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { yup } from '@app/schemas'
import { TrainerInput, TransportMethod } from '@app/types'

import {
  FormValues as Entry,
  makeSchema,
  TrainerExpenses,
} from './TrainerExpenses'

export type FormValues = Record<string, Entry>

type Props = {
  initialValues?: FormValues
  trainers?: TrainerInput[]
  onChange?: (data: FormValues, isValid: boolean) => void
}

const TrainerExpensesForm: React.FC<Props> = ({
  trainers = [],
  onChange = noop,
  initialValues = undefined,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(
    () => yup.lazy(obj => yup.object(mapValues(obj, () => makeSchema(t)))),
    [t]
  )

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues:
      initialValues ??
      zipObject(
        trainers.map(t => t.profile_id),
        trainers.map(_ => ({
          transport: [
            {
              accommodationNights: 0,
              method: TransportMethod.NONE,
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
          <Box
            data-testid={`trainer-${trainer.profile_id}`}
            key={trainer.profile_id}
          >
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
          </Box>
        ))}
      </Box>
    </Stack>
  )
}

export default memo(TrainerExpensesForm)
