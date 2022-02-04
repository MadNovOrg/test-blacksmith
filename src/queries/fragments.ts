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
