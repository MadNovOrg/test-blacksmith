import { Course_Source_Enum } from '@app/generated/graphql'
import { PaymentMethod } from '@app/types'

import * as API from '@qa/api'
import { getProfileId } from '@qa/api/hasura/profile'
import { users } from '@qa/data/users'

import { Course, OrderCreation, User } from './types'

export const UNIQUE_ORDER: (
  orderOwner: User,
  registrants: User[],
  course?: Course,
) => Promise<OrderCreation> = async (
  orderOwner: User,
  registrants: User[],
  course?: Course,
) => ({
  ...(course && { courseId: course.id }),
  billingAddress: 'Tankfield, Convent Hill, Tramore, Waterford, X91 PV08',
  billingEmail: orderOwner.email,
  billingFamilyName: orderOwner.familyName,
  billingGivenName: orderOwner.givenName,
  billingPhone: '+44 07849 123456',
  clientPurchaseOrder: '12345',
  organizationId: await API.organization.getOrganizationId(
    orderOwner.organization?.name ?? '',
  ),
  paymentMethod: PaymentMethod.INVOICE,
  promoCodes: [],
  quantity: 1,
  registrants: registrants.map(user => ({
    email: user.email,
    firstName: user.givenName,
    lastName: user.familyName,
  })),
  salesRepresentativeId: await getProfileId(users.admin.email),
  source: Course_Source_Enum.EmailEnquiry,
})
