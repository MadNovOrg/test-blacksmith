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
  fragment Profile on profile {
    id
    givenName
    familyName
    title
    tags
    status
    addresses
    attributes
    contactDetails
    preferences
    status
    createdAt
    updatedAt
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
    submitted
    level
    reaccreditation
  }
`
