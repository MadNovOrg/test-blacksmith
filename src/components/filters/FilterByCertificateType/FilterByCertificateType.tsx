import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { noop } from '@app/util'

type Props = {
  onChange: (selected: CertificateTypeEnum[]) => void
}

export enum CertificateTypeEnum {
  Legacy = 'LEGACY',
  Connect = 'CONNECT',
}

const certificateTypes = Object.values(CertificateTypeEnum)

const CertificateTypeParam = withDefault(
  createEnumArrayParam<CertificateTypeEnum>(certificateTypes),
  [] as CertificateTypeEnum[]
)

export const FilterByCertificateType: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const certificateTypeOptions = useMemo(() => {
    return certificateTypes.map(type => ({
      id: type,
      title: t(`certificate-types.${type}`),
    }))
  }, [t])

  const [selected, setSelected] = useQueryParam('type', CertificateTypeParam)

  const options = useMemo(() => {
    return certificateTypeOptions.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [selected, certificateTypeOptions])

  const _onChange = useCallback(
    (opts: FilterOption<CertificateTypeEnum>[]) => {
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
      title={t('certificate-type')}
      onChange={_onChange}
      data-testid="FilterByCertificateType"
    />
  )
}
