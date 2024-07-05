import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { CertificateStatus } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: CertificateStatus[]) => void
  excludedStatuses?: Set<CertificateStatus>
}

const statuses = Object.values(CertificateStatus) as CertificateStatus[]

export const FilterByCertificateValidity: React.FC<
  React.PropsWithChildren<Props>
> = ({ excludedStatuses = new Set(), onChange = noop }) => {
  const { t } = useTranslation()

  const [selected, setSelected] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<CertificateStatus>(statuses),
      [] as CertificateStatus[],
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
    (opts: FilterOption<CertificateStatus>[]) => {
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
