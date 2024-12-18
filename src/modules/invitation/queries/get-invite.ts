import { gql } from 'graphql-request'

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
