import { getI18n } from 'react-i18next'

import {
  XeroAddress,
  XeroInvoiceSummaryFragment,
  XeroLineItem,
} from '@app/generated/graphql'

const { t } = getI18n()

type OnlyXeroDescription = Pick<XeroLineItem, 'description'>

export function isRegistrantLineItem(
  lineItem: OnlyXeroDescription | null,
  courseLevel: string
) {
  return lineItem?.description?.includes(t(`course-levels.${courseLevel}`))
}

export function isGo1LicensesItem(lineItem: OnlyXeroDescription | null) {
  return lineItem?.description?.includes('Go1')
}

export function isDiscountLineItem(lineItem: OnlyXeroDescription | null) {
  return lineItem?.description?.includes('Discount')
}

export function isProcessingFeeLineItem(
  lineItem: Pick<XeroLineItem, 'itemCode'> | null
) {
  return lineItem?.itemCode === 'CREDIT CARD FEE'
}

export function getTrainerExpensesLineItems(
  lineItems: XeroInvoiceSummaryFragment['lineItems'],
  courseLevel: string
) {
  return lineItems.filter(lineItem => {
    return (
      !isDiscountLineItem(lineItem) &&
      !isGo1LicensesItem(lineItem) &&
      !isProcessingFeeLineItem(lineItem) &&
      !isRegistrantLineItem(lineItem, courseLevel)
    )
  })
}

export function formatContactAddress(address: XeroAddress) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}
