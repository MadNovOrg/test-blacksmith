import { gql } from 'graphql-request'
import { OperationContext, useQuery } from 'urql'

import {
  Course_Certificate_Bool_Exp,
  GetCertificationsQuery,
  GetCertificationsQueryVariables,
} from '@app/generated/graphql'

export const GET_CERTIFICATIONS = gql`
  query GetCertifications(
    $limit: Int
    $offset: Int
    $where: course_certificate_bool_exp = {}
  ) {
    certifications: course_certificate(
      where: $where
      limit: $limit
      offset: $offset
    ) {
      status
      id
      number
      expiryDate
      legacyCourseCode
      certificationDate
      courseName
      courseLevel
      profile {
        id
        fullName
        avatar
        archived
        email
        contactDetails
        organizations {
          organization {
            id
            name
          }
        }
      }
      participant {
        id
        grade
        certificateChanges(order_by: { createdAt: desc }, limit: 1) {
          payload
        }
      }

      course {
        level
        accreditedBy
        go1Integration
        reaccreditation
        course_code
      }
    }
    certificationsAggregation: course_certificate_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export default function useCertifications(options?: {
  pagination?: { limit: number; offset: number }
  where?: Course_Certificate_Bool_Exp
}): {
  data?: GetCertificationsQuery['certifications']
  error?: Error
  total?: number
  fetching?: boolean
  mutate: (opts?: Partial<OperationContext> | undefined) => void
} {
  const queryConditions: Course_Certificate_Bool_Exp[] = []
  if (options?.where) {
    queryConditions.push(options.where)
  }

  const [{ data, error, fetching }, mutate] = useQuery<
    GetCertificationsQuery,
    GetCertificationsQueryVariables
  >({
    query: GET_CERTIFICATIONS,
    variables: {
      limit: options?.pagination?.limit,
      offset: options?.pagination?.offset,
      where: {
        _and: queryConditions,
      },
    },
  })

  return {
    data: data?.certifications,
    error,
    fetching,
    total: data?.certificationsAggregation?.aggregate?.count ?? 0,
    mutate,
  }
}
