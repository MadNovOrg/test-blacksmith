import useSWR from 'swr'
import { KeyedMutator } from 'swr/dist/types'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-org-details'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useOrg(orgId: string): {
  data?: ResponseType['org']
  activeCertificatesCount?: number
  expiredCertificatesCount?: number
  error?: Error
  status: LoadingStatus
  mutate: KeyedMutator<ResponseType>
} {
  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType] | null
  >(orgId ? [QUERY, { orgId }] : null)

  return {
    data: data?.org,
    activeCertificatesCount: data?.activeCertificates.aggregate.count,
    expiredCertificatesCount: data?.expiredCertificates.aggregate.count,
    error,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
