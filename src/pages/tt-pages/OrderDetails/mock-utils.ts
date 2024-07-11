import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'
import { addDays } from 'date-fns'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
  GetOrderQuery,
  GetPromoCodesQuery,
  Payment_Methods_Enum,
  Promo_Code_Type_Enum,
  Xero_Contact,
  Xero_Invoice,
  Xero_Invoice_Status_Enum,
  XeroLineItemSummaryFragment,
  XeroPhoneType,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

const chance = new Chance()

export const buildOrder = build<NonNullish<GetOrderQuery['order']>>({
  fields: [
    {
      quantity: 1,
      order: {
        id: perBuild(() => chance.guid()),
        profileId: perBuild(() => chance.guid()),
        registrants: [],
        paymentMethod: Payment_Methods_Enum.Invoice,
        orderTotal: chance.integer(),
        orderDue: chance.date(),
        promoCodes: [],
        xeroInvoiceNumber: 'INV-001',
        currency: 'GBP',
        organizationId: chance.guid(),
        salesRepresentative: null,
        billingAddress: chance.address(),
        billingEmail: chance.email(),
        billingFamilyName: chance.name(),
        billingGivenName: chance.name(),
        billingPhone: chance.phone(),
        organization: {
          name: chance.name(),
        },
        user: {
          fullName: chance.name({ full: true }),
          email: chance.email(),
          phone: chance.phone(),
        },
      },
      course: {
        id: chance.integer(),
        max_participants: chance.integer(),
        go1Integration: chance.bool(),
        course_code: 'course-code',
        level: Course_Level_Enum.Level_1,
        name: chance.name(),
        type: Course_Type_Enum.Open,
        start: {
          aggregate: { date: { start: new Date().toISOString() } },
        },
        end: {
          aggregate: { date: { end: new Date().toISOString() } },
        },
        residingCountry: 'GB-ENG',
        deliveryType: Course_Delivery_Type_Enum.F2F,
      },
    },
  ],
})

export const buildInvoiceContact = build<Xero_Contact>({
  fields: {
    id: chance.guid(),
    xeroId: chance.string(),
    name: chance.name({ full: true }),
    emailAddress: chance.email(),
    firstName: chance.name(),
    lastName: chance.name(),
    addresses: [],
    phones: [
      {
        phoneCountryCode: '+44',
        phoneAreaCode: '020',
        phoneNumber: chance.phone(),
        phoneType: XeroPhoneType.Default,
      },
    ],
  },
})
export const buildInvoice = build<Xero_Invoice>({
  fields: {
    id: chance.guid(),
    invoiceNumber: chance.string(),
    reference: chance.string(),
    xeroContactId: chance.guid(),
    issuedDate: chance.date().toISOString(),
    total: chance.integer(),
    status: Xero_Invoice_Status_Enum.Draft,
    _status: Xero_Invoice_Status_Enum.Draft,
    dueDate: chance.date().toISOString(),
    subtotal: chance.integer(),
    totalTax: chance.integer(),
    xeroId: chance.guid(),
    amountDue: String(chance.integer()),
    amountPaid: String(0),
    currencyCode: Currency.Gbp,
    lineItems: [],
    contact: buildInvoiceContact(),
  },
})

export const buildLineItem = build<XeroLineItemSummaryFragment>({
  fields: {
    description: chance.sentence(),
    quantity: 1,
    unitAmount: chance.integer({ min: 10, max: 200 }),
    lineAmount: chance.integer({ min: 10, max: 200 }),
    itemCode: chance.word(),
    accountCode: chance.word(),
    item: {
      itemID: chance.word(),
      code: chance.word(),
    },
    taxType: 'None',
    taxAmount: 0,
    tracking: [],
  },
})

export const buildPromo = build<
  NonNullish<GetPromoCodesQuery['promoCodes'][number]>
>({
  fields: {
    id: chance.guid(),
    amount: chance.integer({ min: 1, max: 10 }),
    type: Promo_Code_Type_Enum.Percent,
    approvedBy: chance.guid(),
    deniedBy: chance.guid(),
    description: chance.sentence(),
    code: chance.word(),
    validFrom: new Date().toISOString(),
    validTo: addDays(new Date(), 5).toISOString(),
    enabled: true,
    bookerSingleUse: false,
    createdBy: chance.guid(),
    createdAt: new Date().toString(),
    levels: [Course_Level_Enum.Level_1],
    updatedAt: null,
    creator: {
      id: chance.guid(),
      avatar: chance.url(),
      fullName: chance.name({ full: true }),
    },
    courses: [],
    disabled: false,
  },
})
