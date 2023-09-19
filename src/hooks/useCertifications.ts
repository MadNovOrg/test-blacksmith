import useSWR, { KeyedMutator } from 'swr'

import {
  Course_Certificate_Bool_Exp,
  Course_Certificate_Order_By,
  GetCertificationsQuery,
  GetCertificationsQueryVariables,
  Order_By,
} from '@app/generated/graphql'
import { GET_CERTIFICATIONS } from '@app/queries/certificate/get-certifications'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCertifications(options?: {
  order?: Order_By
  pagination?: { limit: number; offset: number }
  where?: Course_Certificate_Bool_Exp
}): {
  data?: GetCertificationsQuery['certifications']
  error?: Error
  total?: number
  status: LoadingStatus
  mutate: KeyedMutator<GetCertificationsQuery>
} {
  const order = options?.order ?? Order_By.Asc
  const orderBy: Course_Certificate_Order_By = {
    profile: { fullName: order },
  }

  const queryConditions: Course_Certificate_Bool_Exp[] = []
  if (options?.where) {
    queryConditions.push(options.where)
  }

  const { data, error, mutate } = useSWR<
    GetCertificationsQuery,
    Error,
    [string, GetCertificationsQueryVariables]
  >([
    GET_CERTIFICATIONS,
    {
      limit: options?.pagination?.limit,
      offset: options?.pagination?.offset,
      where: { _and: queryConditions },
      orderBy,
    },
  ])

  return {
    data: data?.certifications,
    error,
    total: data?.certificationsAggregation?.aggregate?.count ?? 0,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
