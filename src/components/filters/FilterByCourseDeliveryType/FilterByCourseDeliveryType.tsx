import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Course_Delivery_Type_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: Course_Delivery_Type_Enum[]) => void
}

const deliveryTypes = Object.values(Course_Delivery_Type_Enum)

const CourseDeliveryParam = withDefault(
  createEnumArrayParam<Course_Delivery_Type_Enum>(deliveryTypes),
  [] as Course_Delivery_Type_Enum[]
)

export const FilterByCourseDeliveryType: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const deliveryOptions = useMemo(() => {
    return deliveryTypes.map(delivery => ({
      id: delivery,
      title: t(`course-delivery-type.${delivery}`),
    }))
  }, [t])

  const [selected, setSelected] = useQueryParam('delivery', CourseDeliveryParam)

  const options = useMemo(() => {
    return deliveryOptions.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [selected, deliveryOptions])

  const _onChange = useCallback(
    (opts: FilterOption<Course_Delivery_Type_Enum>[]) => {
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
      title={t('delivery')}
      onChange={_onChange}
      data-testid="FilterByCourseDeliveryType"
    />
  )
}
