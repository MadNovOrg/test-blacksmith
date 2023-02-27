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
    sector
    trustName
    trustType
    geoCoordinates
  }
`

export const PROFILE = gql`
  ${ORGANIZATION}
  fragment Profile on profile {
    id
    givenName
    familyName
    fullName
    avatar
    title
    tags
    addresses
    attributes
    contactDetails
    dietaryRestrictions
    disabilities
    archived
    organizations {
      id
      isAdmin
      position
      organization {
        ...Organization
      }
    }
    roles {
      role {
        id
        name
      }
    }
    trainer_role_types {
      trainer_role_type {
        id
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
    dbs
    lastActivity
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
    course_code
    reaccreditation
    min_participants
    max_participants
    gradingConfirmed
    gradingStarted
    go1Integration
    aolCostOfCourse
    aolCountry
    aolRegion
    modulesDuration
    notes
    start
    end
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
    downloads {
      file {
        mediaItemUrl
      }
    }
    date
    videoSeriesCategories {
      nodes {
        id
        name
      }
    }
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
    customAuthor {
      displayAuthor
      authorName
    }
    categories {
      nodes {
        id
        name
      }
    }
  }
`

export const PodcastSummary = gql`
  fragment PodcastSummary on Podcast {
    id
    name
    thumbnail
    publishedDate
    mediaUrl
    author
    description
    episodeNumber
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
      file {
        mediaItemUrl
      }
    }
    ebooksCategories {
      nodes {
        id
        name
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
      file {
        mediaItemUrl
      }
    }
    researchSummariesCategories {
      nodes {
        id
        name
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
    webinarsCategories {
      nodes {
        id
        name
      }
    }
  }
`

export const CourseTrainerInfo = gql`
  fragment CourseTrainerInfo on course_trainer {
    id
    status
    type
    profile {
      id
      fullName
      avatar
      archived
    }
  }
`

export const Waitlist = gql`
  fragment WaitlistSummary on waitlist {
    id
    email
    phone
    orgName
    courseId
    confirmed
    createdAt
    givenName
    familyName
  }
`

export const XeroPhone = gql`
  fragment XeroPhoneSummary on XeroPhone {
    phoneCountryCode
    phoneAreaCode
    phoneNumber
    phoneType
  }
`

export const XeroAddress = gql`
  fragment XeroAddressSummary on XeroAddress {
    addressType
    addressLine1
    addressLine2
    city
    region
    postalCode
    country
  }
`

export const XeroContact = gql`
  ${XeroAddress}
  ${XeroPhone}

  fragment XeroContactSummary on XeroContact {
    name
    firstName
    lastName
    emailAddress
    phones {
      ...XeroPhoneSummary
    }
    addresses {
      ...XeroAddressSummary
    }
  }
`

export const XeroItem = gql`
  fragment XeroItemSummary on XeroItem {
    itemID
    code
  }
`

export const XeroLineItem = gql`
  ${XeroItem}

  fragment XeroLineItemSummary on XeroLineItem {
    description
    quantity
    unitAmount
    itemCode
    accountCode
    item {
      ...XeroItemSummary
    }
    taxType
    taxAmount
    lineAmount
    tracking {
      name
      option
    }
  }
`

export const XeroInvoice = gql`
  ${XeroLineItem}
  ${XeroContact}

  fragment XeroInvoiceSummary on XeroInvoice {
    date
    total
    status
    contact {
      ...XeroContactSummary
    }
    dueDate
    subTotal
    totalTax
    invoiceID
    amountDue
    lineItems {
      ...XeroLineItemSummary
    }
    reference
    amountPaid
    currencyCode
    invoiceNumber
    fullyPaidOnDate
  }
`

export const ESTABLISHMENT = gql`
  fragment Establishment on dfe_establishment {
    id
    urn
    name
    localAuthority
    trustType
    trustName
    addressLineOne
    addressLineTwo
    addressLineThree
    town
    county
    postcode
    headTitle
    headFirstName
    headLastName
    headJobTitle
    ofstedRating
    ofstedLastInspection
  }
`
