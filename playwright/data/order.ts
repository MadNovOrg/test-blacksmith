import { PaymentMethod } from '@app/types'

import * as API from '../api'

import { Course, OrderCreation, User } from './types'

export const UNIQUE_ORDER: (
  course: Course,
  orderOwner: User,
  registrants: User[]
) => Promise<OrderCreation> = async (
  course: Course,
  orderOwner: User,
  registrants: User[]
) => ({
  courseId: course.id,
  quantity: 1,
  paymentMethod: PaymentMethod.INVOICE,
  billingAddress: 'Tankfield, Convent Hill, Tramore,Waterford, X91 PV08',
  billingGivenName: orderOwner.givenName,
  billingFamilyName: orderOwner.familyName,
  billingEmail: orderOwner.email,
  billingPhone: '+44 07849 123456',
  clientPurchaseOrder: '12345',
  registrants: registrants.map(user => ({
    email: user.email,
    firstName: user.givenName,
    lastName: user.familyName,
  })),
  organizationId: await API.organization.getOrganizationId(
    orderOwner.organization?.name ?? ''
  ),
  promoCodes: [],
})
