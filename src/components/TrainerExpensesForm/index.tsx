import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Box, Stack } from '@mui/material'
import { mapValues, zipObject } from 'lodash-es'
import React, { memo, useEffect, useMemo } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { yup } from '@app/schemas'
import { TrainerInput, TransportMethod } from '@app/types'

import {
  FormValues as Entry,
  makeSchema,
  TrainerExpenses,
} from './TrainerExpenses'

export type FormValues = { expenses: Record<string, Entry> }

type Props = {
  initialValues?: FormValues['expenses']
  trainers?: TrainerInput[]
  onChange?: (data: FormValues['expenses'], isValid: boolean) => void
}

const TrainerExpensesForm: React.FC<React.PropsWithChildren<Props>> = ({
  trainers = [],
  onChange = noop,
  initialValues = undefined,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup.object({
        expenses: yup.lazy(obj =>
          yup.object(mapValues(obj, () => makeSchema(t)))
        ),
      }),
    [t]
  )

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      expenses:
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
    },
    resolver: yupResolver(schema),
  })

  const formValues = useWatch({
    control: form.control,
  })

  useEffect(() => {
    if (formValues.expenses) {
      onChange(
        formValues.expenses as FormValues['expenses'],
        form.formState.isValid
      )
    }
  }, [formValues, form.formState, onChange])

  return (
    <Box component="form" data-testid="TrainerExpenses-form">
      <Box>
        <Typography variant="subtitle1" mb={2}>
          {t('pages.create-course.trainer-expenses.title')}
        </Typography>

        <Stack spacing={3}>
          {trainers.map(trainer => (
            <Box
              data-testid={`trainer-${trainer.profile_id}`}
              key={trainer.profile_id}
            >
              <Controller
                name={`expenses.${trainer.profile_id}`}
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
        </Stack>
      </Box>
    </Box>
  )
}

export default memo(TrainerExpensesForm)
