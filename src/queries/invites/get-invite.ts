import { gql } from 'graphql-request'

import { CourseDeliveryType } from '@app/generated/graphql'

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
    deliveryType: CourseDeliveryType
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

export const QUERY = gql`
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
    }
  }
`
