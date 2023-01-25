import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
  GetOrderQuery,
  Payment_Methods_Enum,
  XeroInvoiceStatus,
  XeroInvoiceSummaryFragment,
  XeroPhoneType,
} from '@app/generated/graphql'

const chance = new Chance()

export const buildOrder = build<GetOrderQuery['order']>({
  fields: {
    id: perBuild(() => chance.guid()),
    courseId: perBuild(() => chance.integer()),
    profileId: perBuild(() => chance.guid()),
    quantity: 1,
    registrants: [],
    paymentMethod: Payment_Methods_Enum.Invoice,
    orderTotal: chance.integer(),
    orderDue: chance.date(),
    promoCodes: [],
    xeroInvoiceNumber: 'INV-001',
    currency: 'GBP',
    course: {
      id: chance.integer(),
      course_code: 'course-code',
      level: Course_Level_Enum.Level_1,
      name: chance.name(),
      type: Course_Type_Enum.Open,
      salesRepresentative: null,
    },
    profile: {
      fullName: chance.name({ full: true }),
      email: chance.email(),
      phone: chance.phone(),
    },
  },
})

export const buildInvoice = build<XeroInvoiceSummaryFragment>({
  fields: {
    date: chance.date().toISOString(),
    total: chance.integer(),
    status: XeroInvoiceStatus.Draft,
    dueDate: chance.date().toISOString(),
    subTotal: chance.integer(),
    totalTax: chance.integer(),
    invoiceID: chance.guid(),
    amountDue: String(chance.integer()),
    amountPaid: String(0),
    currencyCode: Currency.Gbp,
    lineItems: [],
    contact: {
      name: chance.name({ full: true }),
      emailAddress: chance.email(),
      phones: [
        {
          phoneCountryCode: '+44',
          phoneAreaCode: '020',
          phoneNumber: chance.phone(),
          phoneType: XeroPhoneType.Default,
        },
      ],
    },
  },
})
