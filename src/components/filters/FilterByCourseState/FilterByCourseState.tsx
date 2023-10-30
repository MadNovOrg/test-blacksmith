import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { CourseState } from '@app/types'

type Props = {
  onChange: (selected: CourseState[]) => void
}

const types = Object.values(CourseState)

const CourseStateParam = withDefault(
  createEnumArrayParam<CourseState>(types),
  [] as CourseState[]
)

export const FilterByCourseState: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation()

  const stateOptions = useMemo(() => {
    return types.map(state => ({
      id: state,
      title: t(`course-states.${state}`),
    }))
  }, [t])

  const [selected, setSelected] = useQueryParam('state', CourseStateParam)

  const _onChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newSelection: CourseState[]) => {
      setSelected(newSelection)
      onChange(newSelection)
    },
    [onChange, setSelected]
  )

  useEffectOnce(() => {
    onChange(selected)
  })

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="body2" fontWeight="bold">
        {t('filters.state')}
      </Typography>
      <ToggleButtonGroup
        orientation="vertical"
        size="small"
        value={selected}
        onChange={_onChange}
        data-testid="FilterByCourseState"
      >
        {stateOptions.map(option => (
          <ToggleButton key={option.id} value={option.id}>
            {option.title}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
