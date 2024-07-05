import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { grey } from '@mui/material/colors'
import FormControlLabel from '@mui/material/FormControlLabel'
import { formControlLabelClasses } from '@mui/material/FormControlLabel'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import { useQueryParam, withDefault, BooleanParam } from 'use-query-params'

import { Course_Status_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

type Props = {
  onChange: (filterStatusesWarning: Course_Status_Enum[]) => void
}

export const FilterByCourseStatusWarnings: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [filterWarningStatuses, setFilterWarningStatuses] = useQueryParam(
    'warnings',
    withDefault(BooleanParam, false),
  )

  const warningValues = useMemo(
    () => [
      Course_Status_Enum.ConfirmModules,
      Course_Status_Enum.EvaluationMissing,
      Course_Status_Enum.ExceptionsApprovalPending,
      Course_Status_Enum.GradeMissing,
      Course_Status_Enum.TrainerPending,
    ],
    [],
  )

  const handledChange = useCallback(
    (selected: boolean) => {
      setFilterWarningStatuses(selected)
      onChange(selected ? warningValues : [])
    },
    [onChange, setFilterWarningStatuses, warningValues],
  )

  useEffectOnce(() => {
    onChange(filterWarningStatuses ? warningValues : [])
  })

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${grey['400']}`,
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={filterWarningStatuses}
            onChange={(event, checked) => handledChange(checked)}
          />
        }
        label={t('filters.warning-statuses')}
        sx={{
          [`& .${formControlLabelClasses.label}`]: {
            fontSize: '.95rem',
            color: grey['800'],
          },
        }}
      />
    </Box>
  )
}
