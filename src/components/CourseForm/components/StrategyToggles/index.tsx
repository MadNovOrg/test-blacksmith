import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { useAuth } from '@app/context/auth'
import { yup } from '@app/schemas'
import { BildStrategies } from '@app/types'

export const schema = yup.object({
  [BildStrategies.Primary]: yup.bool(),
  [BildStrategies.Secondary]: yup.bool(),
  [BildStrategies.NonRestrictiveTertiary]: yup.bool(),
  [BildStrategies.RestrictiveTertiaryIntermediate]: yup.bool(),
  [BildStrategies.RestrictiveTertiaryAdvanced]: yup.bool(),
})

export function validateStrategies(s: yup.Schema<InferType<typeof schema>>) {
  return s.test(
    'strategies-selected',
    strategies => Object.keys(strategies).length > 0
  )
}

type FormFields = { bildStrategies: InferType<typeof schema> }

export const StrategyToggles: React.FC = () => {
  const { t } = useTranslation()
  const { control, setValue, watch } = useFormContext<FormFields>()
  const { acl } = useAuth()

  const tertiaryIntermediate = watch(
    'bildStrategies.RESTRICTIVE_TERTIARY_INTERMEDIATE'
  )

  useEffect(() => {
    if (tertiaryIntermediate === true) {
      setValue('bildStrategies.RESTRICTIVE_TERTIARY_ADVANCED', false as never)
    }
  }, [tertiaryIntermediate, setValue])

  return (
    <Grid container data-testid="strategy-toggles">
      <Grid item xs={6}>
        <Controller
          name={`bildStrategies.${BildStrategies.Primary}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} checked={field.value === true} />}
                label={t(`common.bild-strategies.${BildStrategies.Primary}`)}
              />
            </FormGroup>
          )}
        />

        <Controller
          name={`bildStrategies.${BildStrategies.Secondary}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} checked={field.value === true} />}
                label={t(`common.bild-strategies.${BildStrategies.Secondary}`)}
              />
            </FormGroup>
          )}
        />

        <Controller
          name={`bildStrategies.${BildStrategies.NonRestrictiveTertiary}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} checked={field.value === true} />}
                label={t(
                  `common.bild-strategies.${BildStrategies.NonRestrictiveTertiary}`
                )}
              />
            </FormGroup>
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name={`bildStrategies.${BildStrategies.RestrictiveTertiaryIntermediate}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} checked={field.value === true} />}
                label={t(
                  `common.bild-strategies.${BildStrategies.RestrictiveTertiaryIntermediate}`
                )}
              />
            </FormGroup>
          )}
        />

        <Controller
          name={`bildStrategies.${BildStrategies.RestrictiveTertiaryAdvanced}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value === true}
                    disabled={
                      tertiaryIntermediate === true ||
                      !acl.canDeliveryTertiaryAdvancedStrategy()
                    }
                  />
                }
                label={t(
                  `common.bild-strategies.${BildStrategies.RestrictiveTertiaryAdvanced}`
                )}
              />
            </FormGroup>
          )}
        />
      </Grid>
    </Grid>
  )
}
