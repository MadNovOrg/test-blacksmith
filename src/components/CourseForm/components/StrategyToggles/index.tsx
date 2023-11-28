import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material'
import { TFunction } from 'i18next'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { useAuth } from '@app/context/auth'
import { Course_Level_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { BildStrategies, CourseInput } from '@app/types'

export const schema = yup.object({
  [BildStrategies.Primary]: yup.bool(),
  [BildStrategies.Secondary]: yup.bool(),
  [BildStrategies.NonRestrictiveTertiary]: yup.bool(),
  [BildStrategies.RestrictiveTertiaryIntermediate]: yup.bool(),
  [BildStrategies.RestrictiveTertiaryAdvanced]: yup.bool(),
})

export function validateStrategies(
  s: yup.Schema<InferType<typeof schema>>,
  t: TFunction
) {
  return s.test(
    'strategies-selected',
    t('components.course-form.bild-strategies-required'),
    strategies => {
      const selectedStrategies = Object.keys(strategies).filter(
        name => strategies[name as BildStrategies]
      )
      return selectedStrategies.length > 0
    }
  )
}

type Schema = InferType<typeof schema>

export const defaultStrategies = {
  PRIMARY: false,
  SECONDARY: false,
  NON_RESTRICTIVE_TERTIARY: false,
  RESTRICTIVE_TERTIARY_INTERMEDIATE: false,
  RESTRICTIVE_TERTIARY_ADVANCED: false,
} as const

type FormFields = { bildStrategies: Schema }

type Props = {
  courseLevel: CourseInput['courseLevel']
  disabled?: boolean
}

export const StrategyToggles: React.FC<Props> = ({
  courseLevel,
  disabled = false,
}) => {
  const { t } = useTranslation()
  const { control, setValue, resetField } = useFormContext<FormFields>()
  const { acl } = useAuth()

  const isTrainerLevel = Boolean(
    courseLevel &&
      [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ].includes(courseLevel as Course_Level_Enum)
  )

  useEffect(() => {
    if (!courseLevel) {
      return
    }

    if (isTrainerLevel) {
      setValue('bildStrategies', {
        PRIMARY: true,
        SECONDARY: true,
        NON_RESTRICTIVE_TERTIARY: true,
        RESTRICTIVE_TERTIARY_INTERMEDIATE: true,
        RESTRICTIVE_TERTIARY_ADVANCED:
          courseLevel === Course_Level_Enum.BildAdvancedTrainer,
      })
    } else {
      resetField('bildStrategies')
    }
  }, [isTrainerLevel, setValue, courseLevel, resetField])

  return (
    <Grid container data-testid="strategy-toggles">
      <Grid item xs={6}>
        <Controller
          name={`bildStrategies.${BildStrategies.Primary}`}
          control={control}
          render={({ field }) => (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value === true}
                    disabled={isTrainerLevel || disabled}
                  />
                }
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
                control={
                  <Switch
                    {...field}
                    checked={field.value === true}
                    disabled={isTrainerLevel || disabled}
                  />
                }
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
                control={
                  <Switch
                    {...field}
                    checked={field.value === true}
                    disabled={isTrainerLevel || disabled}
                  />
                }
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
                control={
                  <Switch
                    {...field}
                    checked={field.value === true}
                    disabled={isTrainerLevel || disabled}
                  />
                }
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
                      isTrainerLevel ||
                      !acl.canDeliveryTertiaryAdvancedStrategy() ||
                      disabled
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
