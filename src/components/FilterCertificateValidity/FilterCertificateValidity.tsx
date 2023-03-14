import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { CertificateStatus } from '@app/types'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: CertificateStatus[]) => void
}

const statuses = Object.values(CertificateStatus) as CertificateStatus[]

export const FilterCertificateValidity: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [selected, setSelected] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<CertificateStatus>(statuses),
      [] as CertificateStatus[]
    )
  )

  const options = useMemo(() => {
    return statuses.map(o => ({
      id: o,
      title: t(`certification-status.${o.toLocaleLowerCase()}`),
      selected: selected.includes(o),
    }))
  }, [selected, t])

  const _onChange = useCallback(
    (opts: FilterOption<CertificateStatus>[]) => {
      const sel = opts.flatMap(o => (o.selected ? o.id : []))
      setSelected(sel)
      onChange(sel)
    },
    [onChange, setSelected]
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
