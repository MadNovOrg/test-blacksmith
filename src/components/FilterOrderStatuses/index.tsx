import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { XeroInvoiceStatus } from '@app/generated/graphql'

type Props = {
  onChange: (input: { statuses: XeroInvoiceStatus[] }) => void
}

const possibleStatuses = Object.values(XeroInvoiceStatus)

export const FilterOrderStatuses: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
}) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    const usedTitles: string[] = []

    return possibleStatuses
      .map(s => ({
        id: s,
        title: t(`filters.${s}`),
        selected: false,
      }))
      .reduce((res: FilterOption[], entry: FilterOption) => {
        if (usedTitles.includes(entry.title)) {
          const previousEntry = res.find(
            e => e.title === entry.title
          ) as FilterOption
          previousEntry.id += `,${entry.id}`
        } else {
          res.push({
            ...entry,
            highlight: entry.id === XeroInvoiceStatus.Overdue,
          })

          usedTitles.push(entry.title)
        }

        return res
      }, [])
  })

  const localOnChange = useCallback(
    (opts: FilterOption[]) => {
      setOptions(opts)
      onChange({
        statuses: opts.flatMap(o =>
          o.selected ? o.id.split(',') : []
        ) as XeroInvoiceStatus[],
      })
    },
    [onChange]
  )

  return (
    <FilterAccordion
      options={options}
      title={t('filters.status')}
      onChange={localOnChange}
    />
  )
}
