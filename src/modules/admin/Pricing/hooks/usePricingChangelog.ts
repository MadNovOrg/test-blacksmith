import { useQuery } from 'urql'

import {
  Course_Pricing,
  PricingChangelogQuery,
  PricingChangelogQueryVariables,
} from '@app/generated/graphql'

import { GET_PRICING_CHANGELOG } from '../queries'

export const usePricingChangelog = ({
  coursePricing,
  perPage,
  currentPage,
}: {
  coursePricing: Course_Pricing | null | undefined
  perPage: number
  currentPage: number
}) => {
  return useQuery<PricingChangelogQuery, PricingChangelogQueryVariables>({
    query: GET_PRICING_CHANGELOG,
    variables: {
      ...(coursePricing
        ? {
            where: { coursePricingId: { _eq: coursePricing.id } },
          }
        : {}),
      limit: perPage,
      offset: currentPage * perPage,
    },
    pause: !coursePricing?.id,
  })
}
