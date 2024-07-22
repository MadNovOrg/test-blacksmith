import { gql } from 'graphql-request'

import { Course_Delivery_Type_Enum } from '@app/generated/graphql'

export type ResponseType = {
  invite: {
    id: string
    status: string
    courseId: string
    courseName: string
    description: string
    trainerName: string
    startDate: string
    endDate: string
    deliveryType: Course_Delivery_Type_Enum
    venueName: string
    venueAddress: {
      addressLineOne: string
      addressLineTwo: string
      city: string
      postCode: string
    }
    venueCoordinates: string
  }
}

export type ParamsType = never

export const GET_INVITE_QUERY = gql`
  query GetInvite {
    invite: getInvite {
      id
      status
      courseId
      courseName
      description
      trainerName
      startDate
      endDate
      deliveryType
      venueName
      venueAddress {
        addressLineOne
        addressLineTwo
        city
        postCode
      }
      venueCoordinates
      timeZone
    }
  }
`
