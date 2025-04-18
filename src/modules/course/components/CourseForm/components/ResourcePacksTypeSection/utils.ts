import { TFunction } from 'i18next'
import { cond, constant, matches, stubTrue } from 'lodash'

import {
  Resource_Packs_Delivery_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'

import { ResourcePacksOptions } from './types'

type ResourcePacksCourseFieldsCondition = {
  resourcePacksDeliveryType: Resource_Packs_Delivery_Type_Enum | null
  resourcePacksType: Resource_Packs_Type_Enum
}

export const getResourcePacksTypeOptionLabels = (t: TFunction) => ({
  [ResourcePacksOptions.DigitalWorkbook]: t(
    'components.course-form.resource-pack-digital-workbook',
  ),
  [ResourcePacksOptions.PrintWorkbookStandard]: t(
    'components.course-form.resource-pack-print-workbook.STANDARD',
  ),
  [ResourcePacksOptions.PrintWorkbookExpress]: t(
    'components.course-form.resource-pack-print-workbook.EXPRESS',
  ),
})

export const COURSE_FORM_RESOURCE_PACKS_OPTION_TO_COURSE_FIELDS = {
  [ResourcePacksOptions.DigitalWorkbook]: {
    resourcePacksDeliveryType: null,
    resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
  },
  [ResourcePacksOptions.PrintWorkbookExpress]: {
    resourcePacksDeliveryType: Resource_Packs_Delivery_Type_Enum.Express,
    resourcePacksType: Resource_Packs_Type_Enum.PrintWorkbook,
  },
  [ResourcePacksOptions.PrintWorkbookStandard]: {
    resourcePacksDeliveryType: Resource_Packs_Delivery_Type_Enum.Standard,
    resourcePacksType: Resource_Packs_Type_Enum.PrintWorkbook,
  },
} as const

export const matchResourcePacksCourseFieldsToSelectOption = cond<
  ResourcePacksCourseFieldsCondition,
  ResourcePacksOptions | undefined
>([
  [
    matches({
      resourcePacksDeliveryType: null,
      resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
    }),
    constant(ResourcePacksOptions.DigitalWorkbook),
  ],
  [
    matches({
      resourcePacksDeliveryType: Resource_Packs_Delivery_Type_Enum.Express,
      resourcePacksType: Resource_Packs_Type_Enum.PrintWorkbook,
    }),
    constant(ResourcePacksOptions.PrintWorkbookExpress),
  ],
  [
    matches({
      resourcePacksDeliveryType: Resource_Packs_Delivery_Type_Enum.Standard,
      resourcePacksType: Resource_Packs_Type_Enum.PrintWorkbook,
    }),
    constant(ResourcePacksOptions.PrintWorkbookStandard),
  ],

  [stubTrue, constant(undefined)],
])
