import { gql } from 'graphql-request'

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
    venueName: string
    venueAddress: string
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
      venueName
      venueAddress
      venueCoordinates
    }
  }
`
