import { gql } from 'graphql-request'

export const ORGANIZATION = gql`
  fragment Organization on organization {
    id
    name
    tags
    status
    contactDetails
    attributes
    addresses
    preferences
    createdAt
    updatedAt
  }
`

export const PROFILE = gql`
  ${ORGANIZATION}
  fragment Profile on profile {
    id
    givenName
    familyName
    fullName
    title
    tags
    status
    addresses
    attributes
    contactDetails
    organizations {
      organization {
        ...Organization
      }
    }
    roles {
      role {
        name
      }
    }
    preferences
    status
    createdAt
    updatedAt
    email
    phone
    dob
    jobTitle
  }
`

export const AVAILABILITY = gql`
  fragment Availability on availability {
    id
    start
    end
    description
    createdAt
    updatedAt
    type
  }
`

export const MODULE = gql`
  fragment Module on module {
    id
    name
    description
    level
    type
    createdAt
    updatedAt
  }
`

export const MODULE_GROUP = gql`
  fragment ModuleGroup on module_group {
    id
    name
    level
    color
    mandatory
    createdAt
    updatedAt
  }
`

export const COURSE = gql`
  fragment Course on course {
    id
    createdAt
    updatedAt
    name
    type
    deliveryType
    status
    level
    reaccreditation
    min_participants
    max_participants
    gradingConfirmed
    go1Integration
    aolCostOfCourse
  }
`

export const COURSE_SCHEDULE = gql`
  fragment CourseSchedule on course_schedule {
    id
    createdAt
    updatedAt
    name
    type
    start
    end
    virtualLink
  }
`

export const VENUE = gql`
  fragment Venue on venue {
    id
    createdAt
    updatedAt
    name
    city
    addressLineOne
    addressLineTwo
    postCode
    geoCoordinates
    googlePlacesId
  }
`

export const CERTIFICATE = gql`
  fragment Certificate on course_certificate {
    id
    createdAt
    updatedAt
    number
    expiryDate
  }
`
