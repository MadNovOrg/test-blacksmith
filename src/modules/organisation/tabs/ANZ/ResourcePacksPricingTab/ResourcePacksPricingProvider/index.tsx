import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CombinedError } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Pricing,
} from '@app/generated/graphql'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { CourseTypeOrgRPPricings } from '@app/util'

import { GroupedResourcePacksPricing } from '../components/ResourcePacksPricingsByCourseType'

export type ContextValue = {
  fetching: boolean
  refetch: () => void
  groupedData: GroupedResourcePacksPricing[]
  pricing: GroupedResourcePacksPricing | null
  setSelectedPricing: (pricing: GroupedResourcePacksPricing | null) => void
  error: CombinedError | undefined
}

export const ResourcePacksPricingContext = React.createContext<
  ContextValue | undefined
>(undefined)

export const ResourcePacksPricingProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { id: orgId } = useParams()

  const [pricing, setPricing] = useState<GroupedResourcePacksPricing | null>(
    null,
  )

  const { data, fetching, error, refetch } = useAllResourcePacksPricing(
    CourseTypeOrgRPPricings,
    orgId ?? '',
  )

  const resourcePacksPricings = useMemo(
    () =>
      fetching
        ? []
        : (data?.resource_packs_pricing as Resource_Packs_Pricing[]),
    [fetching, data],
  )
  const groupedPricings = useMemo(() => {
    const map = new Map<string, Resource_Packs_Pricing[]>()
    resourcePacksPricings.forEach(p => {
      const key = `${p.course_type}-${p.course_level}-${p.reaccred}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)?.push(p)
    })

    return Array.from(map.entries()).map(([key, values]) => {
      const [courseType, courseLevel, reaccred] = key.split('-')
      return {
        key,
        courseType: courseType as Course_Type_Enum,
        courseLevel: courseLevel as Course_Level_Enum,
        reaccred: reaccred === 'true',
        values,
      } as GroupedResourcePacksPricing
    })
  }, [resourcePacksPricings])

  const setSelectedPricing = useCallback<ContextValue['setSelectedPricing']>(
    pricing => {
      setPricing(pricing)
    },
    [],
  )

  const refetchPricings = useCallback(() => {
    refetch({ requestPolicy: 'network-only' })
  }, [refetch])

  const value = useMemo<ContextValue>(
    () => ({
      fetching,
      refetch: refetchPricings,
      groupedData: groupedPricings,
      pricing,
      setSelectedPricing,
      error,
    }),
    [
      fetching,
      refetchPricings,
      groupedPricings,
      pricing,
      setSelectedPricing,
      error,
    ],
  )

  return (
    <ResourcePacksPricingContext.Provider value={value}>
      {children}
    </ResourcePacksPricingContext.Provider>
  )
}
