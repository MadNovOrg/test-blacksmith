import { gql } from 'graphql-request'

export const ORGANIZATION = gql`
  fragment Organization on organization {
    id
    name
    tags
    contactDetails
    attributes
    address
    preferences
    createdAt
    updatedAt
    xeroContactId
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
    addresses
    attributes
    contactDetails
    dietaryRestrictions
    disabilities
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
    createdAt
    updatedAt
    email
    phone
    dob
    jobTitle
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

export const COURSE_DATES = gql`
  fragment CourseDates on course_schedule_aggregate {
    aggregate {
      start: min {
        date: start
      }
      end: max {
        date: end
      }
    }
  }
`

export const COURSE_SCHEDULE = gql`
  fragment CourseSchedule on course_schedule {
    id
    createdAt
    updatedAt
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
    certificationDate
    courseName
    courseLevel
  }
`

export const CERTIFICATE_CHANGELOG = gql`
  fragment CertificateChangelog on course_certificate_changelog {
    id
    createdAt
    updatedAt
    oldGrade
    newGrade
    notes
  }
`

export const LEGACY_CERTIFICATE = gql`
  fragment LegacyCertificate on legacy_certificate {
    id
    number
    courseName
    expiryDate
    certificationDate
  }
`

export const VideoItemSummary = gql`
  fragment VideoItemSummary on VideoSeriesItem {
    id
    title
    excerpt
    featuredImage {
      node {
        mediaItemUrl
        srcSet
      }
    }
    youtube {
      url
      duration
    }
    date
  }
`

export const Tag = gql`
  fragment TagSummary on Tag {
    id
    name
  }
`

export const Category = gql`
  fragment CategorySummary on Category {
    id
    name
  }
`

export const PostSummary = gql`
  ${Tag}

  fragment PostSummary on Post {
    id
    title
    excerpt
    content
    date
    featuredImage {
      node {
        mediaItemUrl
        srcSet
      }
    }
    tags {
      nodes {
        ...TagSummary
      }
    }
    author {
      node {
        firstName
        lastName
      }
    }
    categories {
      nodes {
        id
        name
      }
    }
  }
`

export const EbookSummary = gql`
  fragment EbookSummary on Ebook {
    id
    title
    excerpt
    date
    featuredImage {
      node {
        mediaItemUrl
        srcSet
      }
    }
    downloads {
      researchSummaryFile {
        mediaItemUrl
      }
    }
  }
`

export const ResearchSummaryDetails = gql`
  fragment ResearchSummaryDetails on ResearchSummary {
    id
    title
    excerpt
    date
    featuredImage {
      node {
        mediaItemUrl
        srcSet
      }
    }
    downloads {
      researchSummaryFile {
        mediaItemUrl
      }
    }
  }
`

export const WebinarSummary = gql`
  fragment WebinarSummary on Webinar {
    id
    title
    excerpt
    featuredImage {
      node {
        mediaItemUrl
        srcSet
      }
    }
    youtube {
      url
      duration
    }
    date
  }
`
