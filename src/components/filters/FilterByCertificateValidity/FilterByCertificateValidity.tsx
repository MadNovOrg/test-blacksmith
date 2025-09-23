import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Certificate_Status_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: Certificate_Status_Enum[]) => void
  excludedStatuses?: Set<Certificate_Status_Enum>
}

const statuses = Object.values(Certificate_Status_Enum)

export const FilterByCertificateValidity: React.FC<
  React.PropsWithChildren<Props>
> = ({ excludedStatuses = new Set(), onChange = noop }) => {
  const { t } = useTranslation()

  const [selected, setSelected] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<Certificate_Status_Enum>(statuses),
      [] as Certificate_Status_Enum[],
    ),
  )

  const options = useMemo(() => {
    return statuses
      .map(o =>
        excludedStatuses.has(o)
          ? null
          : {
              id: o,
              title: t(`certification-status.${o.toLocaleLowerCase()}`),
              selected: selected.includes(o),
            },
      )
      .filter(Boolean)
  }, [selected, excludedStatuses, t])

  const _onChange = useCallback(
    (opts: FilterOption<Certificate_Status_Enum>[]) => {
      const sel = opts.flatMap(o => (o.selected ? o.id : []))
      setSelected(sel)
      onChange(sel)
    },
    [onChange, setSelected],
  )

  useEffectOnce(() => {
    onChange(selected)
  })

  return (
    <FilterAccordion
      options={options}
      title={t('certifications-status')}
      onChange={_onChange}
      data-testid="FilterCertificateStatus"
    />
  )
}
