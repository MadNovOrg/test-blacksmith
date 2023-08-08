import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { Xero_Invoice_Status_Enum } from '@app/generated/graphql'

type Props = {
  onChange: (input: { statuses: Xero_Invoice_Status_Enum[] }) => void
}

const possibleStatuses = Object.values(Xero_Invoice_Status_Enum)

export const FilterByOrderStatuses: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange }) => {
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
        ) as Xero_Invoice_Status_Enum[],
      })
    },
    [onChange]
  )

  return (
    <FilterAccordion
      options={options}
      title={t('filters.status')}
      onChange={localOnChange}
      data-testid="status-filter"
    />
  )
}
